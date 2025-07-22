/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { FaCopy, FaEdit } from 'react-icons/fa';
import AudioPlayer from './RecordingDetailView/AudioPlayer';
import ChatPanel from './RecordingDetailView/ChatPanel';
import Header from './RecordingDetailView/Header';
import MobileHeader from './RecordingDetailView/MobileHeader';
import NotesPanel from './RecordingDetailView/NotesPanel';
import SummaryPanel from './RecordingDetailView/SummaryPanel';
import TranscriptPanel from './RecordingDetailView/TranscriptPanel';
import { chatWithRecording } from '@/services/api/recording';

interface RecordingDetailViewProps {
  selectedRecording: any;
  onToggleInbox?: () => void;
  onToggleHighlight?: () => void;
  onEdit?: () => void;
  onReprocessTranscription?: () => void;
  onReprocessSummary?: () => void;
  onDelete?: () => void;
}

const RecordingDetailView: React.FC<RecordingDetailViewProps> = ({
  selectedRecording,
  onToggleHighlight,
  onEdit,
  onReprocessTranscription,
  onReprocessSummary,
  onDelete,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [metaOpen, setMetaOpen] = useState(false);
  const [tab, setTab] = useState('transcript');
  // Mock state for edit, chat, etc.
  const [editingSummary, setEditingSummary] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [summary, setSummary] = useState('');
  const [notes, setNotes] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isWaitingBot, setIsWaitingBot] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (selectedRecording) {
      setSummary(selectedRecording.summary || '');
      setNotes(selectedRecording.notes || '');
      setChatMessages([]);
    }
  }, [selectedRecording]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || isWaitingBot || !selectedRecording?.id) return;
    const newHistory = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newHistory);
    setChatInput('');
    setIsWaitingBot(true);
    try {
      const res = await chatWithRecording(selectedRecording.id, {
        message: chatInput,
        history: newHistory,
      });
      console.log(`bot response: ${res}`);
      // API luôn trả về { response: string }
      // Support both { response: string } and { reply: string }
      const botContent = (res as any).response || (res as any).reply;
      // Nếu là JSON array, parse và push từng câu
      try {
        const parsed = JSON.parse(botContent);
        if (Array.isArray(parsed)) {
          setChatMessages([
            ...newHistory,
            ...parsed.map((item) => ({
              role: 'bot',
              content:
                item.response ||
                item.sentence ||
                item.statement ||
                JSON.stringify(item),
            })),
          ]);
        } else {
          setChatMessages([
            ...newHistory,
            { role: 'bot', content: botContent },
          ]);
        }
      } catch {
        setChatMessages([...newHistory, { role: 'bot', content: botContent }]);
      }
    } catch {
      setChatMessages([...newHistory, { role: 'bot', content: 'Bot error.' }]);
    }
    setIsWaitingBot(false);
  };

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(
        selectedRecording.transcription || '',
      );
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(null), 1500);
    } catch {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(null), 1500);
    }
  };

  if (!selectedRecording) return null;

  // Thêm util parse markdown summary
  /**
   * Interface for meeting note data
   */
  interface MeetingNoteData {
    content: string;
    type: 'markdown';
  }

  /**
   * Processes meeting note markdown text
   * @param noteText Raw meeting note markdown text
   * @returns Processed meeting note data
   */
  const processMeetingNote = (noteText: string): MeetingNoteData => {
    if (!noteText) {
      return {
        content: '',
        type: 'markdown',
      };
    }
    // Clean up the text - handle escaped newlines and basic formatting
    const cleanContent = noteText.replace(/\\n/g, '\n').trim();
    return {
      content: cleanContent,
      type: 'markdown',
    };
  };

  // Thêm biến màu cho markdown render
  const headingColor = useColorModeValue('var(--color-primary)', 'gray.200');
  const subHeadingColor = useColorModeValue(
    'var(--color-secondary)',
    'gray.200',
  );
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const borderColor = useColorModeValue('#eee', '#444');

  // Thêm biến màu cho chat
  const chatBg = useColorModeValue('gray.50', 'gray.800');
  const chatPanelBorder = useColorModeValue('#eee', '#444');
  const chatText = useColorModeValue('gray.800', 'gray.200');
  const chatUserBg = useColorModeValue('#0070f3', 'blue.400');
  const chatUserColor = 'white';
  const chatBotBg = useColorModeValue('gray.200', 'gray.700');
  const chatBotColor = chatText;
  const chatInputBg = useColorModeValue('gray.100', 'gray.700');
  const chatInputBorder = chatPanelBorder;
  const chatInputColor = chatText;

  const formatMeetingNoteForDisplay = (
    noteText: string,
    headingColor: string,
    subHeadingColor: string,
    textColor: string,
    borderColor: string,
  ): string => {
    if (!noteText) {
      return `<div class="p-4 text-center" style="color:${textColor}">Không có nội dung ghi chú.</div>`;
    }
    // Helper function to process bold text in any string
    const processBoldText = (text: string): string => {
      return text.replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="font-weight:600">$1</strong>',
      );
    };
    const processedData = processMeetingNote(noteText);
    const lines = processedData.content.split('\n');
    let html = '';
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Skip empty lines
      if (!trimmedLine) {
        html += '<div class="mb-2"></div>';
        continue;
      }
      // H1 headers (# Title)
      if (trimmedLine.startsWith('# ')) {
        const title = processBoldText(trimmedLine.replace('# ', ''));
        html += `<h1 style="font-size:2rem;font-weight:bold;margin-bottom:20px;margin-top:28px;color:${headingColor}">${title}</h1>`;
      }
      // Main headers (## Title)
      else if (trimmedLine.startsWith('## ')) {
        const title = processBoldText(trimmedLine.replace('## ', ''));
        html += `<h2 style="font-size:1.25rem;font-weight:bold;margin-bottom:16px;margin-top:24px;color:${headingColor}">${title}</h2>`;
      }
      // Sub headers (### Title)
      else if (trimmedLine.startsWith('### ')) {
        const title = processBoldText(trimmedLine.replace('### ', ''));
        html += `<h3 style="font-size:1.125rem;font-weight:600;margin-bottom:12px;margin-top:20px;color:${subHeadingColor}">${title}</h3>`;
      }
      // Sub-sub headers (#### Title)
      else if (trimmedLine.startsWith('#### ')) {
        const title = processBoldText(trimmedLine.replace('#### ', ''));
        html += `<h4 style="font-size:1rem;font-weight:500;margin-bottom:8px;margin-top:16px;color:${textColor}">${title}</h4>`;
      }
      // List items with bullet points (- or *)
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const text = processBoldText(trimmedLine.substring(2));
        const indentLevel = line.length - line.trimStart().length;
        // Determine list style based on indentation
        const bullet =
          '<span style="display:inline-block;width:6px;height:6px;margin-right:8px;margin-top:6px;background:' +
          borderColor +
          ';border-radius:50%"></span>';
        const margin = indentLevel >= 6 ? 40 : indentLevel >= 4 ? 28 : 20;
        html += `<div style="margin-left:${margin}px;margin-bottom:4px;display:flex;align-items:flex-start;color:${textColor}">${bullet}<span>${text}</span></div>`;
      }
      // Sub-list items with + marker
      else if (trimmedLine.startsWith('+ ')) {
        const text = processBoldText(trimmedLine.substring(2));
        html += `<div style="margin-left:48px;margin-bottom:4px;display:flex;align-items:flex-start;color:${textColor}"><span style="display:inline-block;width:4px;height:4px;margin-right:8px;margin-top:6px;background:${borderColor}"></span><span style="font-size:0.95em">${text}</span></div>`;
      }
      // Regular paragraph (including bold text processing)
      else {
        const formattedText = processBoldText(trimmedLine);
        html += `<p style="margin-bottom:8px;color:${textColor}">${formattedText}</p>`;
      }
    }
    return `<div style="color:${textColor}">${html}</div>`;
  };

  // Mobile View
  if (isMobile) {
    return (
      <Flex
        flex="1"
        direction="column"
        overflow="hidden"
        bg="var(--input-bg-light)"
        _dark={{ bg: 'var(--input-bg-dark)' }}
        minH="calc(100vh - 100px)"
        maxH="calc(100vh - 100px)"
      >
        <MobileHeader
          selectedRecording={selectedRecording}
          metaOpen={metaOpen}
          setMetaOpen={setMetaOpen}
          onToggleHighlight={onToggleHighlight}
          onReprocessTranscription={onReprocessTranscription}
          onReprocessSummary={onReprocessSummary}
          onDelete={onDelete}
        />
        <Box
          height="calc(100vh - 100px)"
          minH={0}
          maxH="calc(100vh - 100px)"
          display="flex"
          flexDirection="column"
          bg="var(--input-bg-light)"
          _dark={{ bg: 'var(--input-bg-dark)' }}
        >
          <AudioPlayer
            audio_path={selectedRecording.audio_path}
            duration={selectedRecording.duration}
            file_size={selectedRecording.file_size}
          />
          <Tabs
            variant="soft-rounded"
            colorScheme="blue"
            index={['transcript', 'summary', 'notes', 'chat'].indexOf(tab)}
            onChange={(i) =>
              setTab(['transcript', 'summary', 'notes', 'chat'][i])
            }
            flex="1"
            minH={0}
            display="flex"
            flexDirection="column"
            borderColor="#444"
            bg="var(--input-bg-light)"
            _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
          >
            <TabList
              bg="var(--input-bg-light)"
              _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
              borderBottom="1px solid"
              borderColor="#444"
              px={2}
            >
              <Tab
                _selected={{ bg: '#0070f3', color: '#fff' }}
                borderRadius="xl"
              >
                Transcript
              </Tab>
              <Tab
                _selected={{ bg: '#0070f3', color: '#fff' }}
                borderRadius="xl"
              >
                Summary
              </Tab>
              <Tab
                _selected={{ bg: '#0070f3', color: '#fff' }}
                borderRadius="xl"
              >
                Notes
              </Tab>
              <Tab
                _selected={{ bg: '#0070f3', color: '#fff' }}
                borderRadius="xl"
              >
                Chat
              </Tab>
            </TabList>
            <TabPanels
              flex="1"
              minH={0}
              overflowY="auto"
              bg="var(--input-bg-light)"
              _dark={{ bg: 'var(--input-bg-dark)' }}
              boxShadow="0 2px 8px 0 rgba(0,0,0,0.04)"
              mt={2}
            >
              <TabPanel
                p={4}
                color="var(--text-color-light)"
                _dark={{
                  bg: 'var(--input-bg-dark)',
                  color: 'var(--text-color-dark)',
                }}
              >
                <TranscriptPanel
                  transcript={selectedRecording.transcription}
                  textColor={textColor}
                  borderColor={borderColor}
                  handleCopyTranscript={handleCopyTranscript}
                  copySuccess={copySuccess}
                />
              </TabPanel>
              <TabPanel
                p={4}
                color="var(--text-color-light)"
                _dark={{
                  bg: 'var(--input-bg-dark)',
                  color: 'var(--text-color-dark)',
                }}
              >
                <SummaryPanel
                  summary={summary}
                  editingSummary={editingSummary}
                  setEditingSummary={setEditingSummary}
                  setSummary={setSummary}
                  formatMeetingNoteForDisplay={(noteText) =>
                    formatMeetingNoteForDisplay(
                      noteText,
                      headingColor,
                      subHeadingColor,
                      textColor,
                      borderColor,
                    )
                  }
                />
              </TabPanel>
              <TabPanel
                p={4}
                color="var(--text-color-light)"
                _dark={{
                  bg: 'var(--input-bg-dark)',
                  color: 'var(--text-color-dark)',
                }}
              >
                <NotesPanel
                  notes={notes}
                  editingNotes={editingNotes}
                  setEditingNotes={setEditingNotes}
                  setNotes={setNotes}
                />
              </TabPanel>
              <TabPanel p={4}>
                <ChatPanel
                  chatMessages={chatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleSendChat={handleSendChat}
                  isWaitingBot={isWaitingBot}
                  chatEndRef={chatEndRef}
                  chatBg={chatBg}
                  chatPanelBorder={chatPanelBorder}
                  chatText={chatText}
                  chatUserBg={chatUserBg}
                  chatUserColor={chatUserColor}
                  chatBotBg={chatBotBg}
                  chatBotColor={chatBotColor}
                  chatInputBg={chatInputBg}
                  chatInputBorder={chatInputBorder}
                  chatInputColor={chatInputColor}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    );
  }

  // Desktop View
  return (
    <Flex
      flex="1"
      direction="column"
      overflow="hidden"
      bg="var(--input-bg-light)"
      _dark={{ bg: 'var(--input-bg-dark)' }}
      minH="100vh - 120px"
    >
      <Header
        selectedRecording={selectedRecording}
        onToggleHighlight={onToggleHighlight}
        onEdit={onEdit}
        onReprocessTranscription={onReprocessTranscription}
        onReprocessSummary={onReprocessSummary}
        onDelete={onDelete}
      />
      <Box
        height="calc(100vh - 210px)"
        minH={0}
        bg="var(--input-bg-light)"
        _dark={{ bg: 'var(--input-bg-dark)' }}
      >
        <Flex flex="1" height="100%" minH={0} overflow="hidden">
          {/* Left Panel: Transcript */}
          <Box
            flex="1"
            minW={0}
            display="flex"
            flexDirection="column"
            borderRight="1px solid"
            borderColor="gray.200"
            height="100%"
            minH={0}
            bg="var(--input-bg-light)"
            _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
          >
            <Box
              bg="var(--input-bg-light)"
              _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
              h="60px"
              px={4}
              py={3}
              borderBottom="1px solid"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                size="sm"
                leftIcon={<FaCopy />}
                onClick={handleCopyTranscript}
                bg="#0070f3"
                color="#fff"
                borderRadius="xl"
                _hover={{ bg: '#339dff' }}
              >
                Copy
              </Button>
              {copySuccess && (
                <Text
                  fontSize="sm"
                  color={copySuccess === 'Copied!' ? 'green.500' : 'red.500'}
                  ml={2}
                >
                  {copySuccess}
                </Text>
              )}
              <Button
                size="sm"
                leftIcon={<FaEdit />}
                bg="#0070f3"
                color="#fff"
                borderRadius="xl"
                _hover={{ bg: '#339dff' }}
              >
                Edit
              </Button>
            </Box>
            <Box
              flex="1"
              overflowY="auto"
              p={4}
              minH={0}
              bg="var(--input-bg-light)"
              _dark={{ bg: 'var(--input-bg-dark)' }}
            >
              <TranscriptPanel
                transcript={selectedRecording.transcription}
                textColor={textColor}
                borderColor={borderColor}
                handleCopyTranscript={handleCopyTranscript}
                copySuccess={copySuccess}
              />
            </Box>
          </Box>
          {/* Right Panel: Summary/Notes/Chat */}
          <Box
            flex="1"
            minW={0}
            display="flex"
            flexDirection="column"
            height="100%"
            minH={0}
            bg="var(--input-bg-light)"
            _dark={{ bg: 'var(--input-bg-dark)' }}
          >
            <AudioPlayer
              audio_path={selectedRecording.audio_path}
              duration={selectedRecording.duration}
              file_size={selectedRecording.file_size}
            />
            {notes || summary ? (
              <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                flex="1"
                minH={0}
                display="flex"
                flexDirection="column"
                borderColor="#444"
                bg="var(--input-bg-light)"
                _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
              >
                <TabList
                  bg="var(--input-bg-light)"
                  _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
                  borderBottom="1px solid"
                  borderColor="#eee"
                  px={2}
                >
                  <Tab
                    _selected={{ bg: '#0070f3', color: '#fff' }}
                    borderRadius="xl"
                    fontSize={'13px'}
                  >
                    Summary
                  </Tab>
                  <Tab
                    _selected={{ bg: '#0070f3', color: '#fff' }}
                    borderRadius="xl"
                    fontSize={'13px'}
                  >
                    Notes
                  </Tab>
                  <Tab
                    _selected={{ bg: '#0070f3', color: '#fff' }}
                    borderRadius="xl"
                    fontSize={'13px'}
                  >
                    Chat
                  </Tab>
                </TabList>
                <TabPanels
                  flex="1"
                  overflowY="auto"
                  minH={0}
                  bg="var(--input-bg-light)"
                  _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
                >
                  <TabPanel
                    p={4}
                    color="var(--text-color-light)"
                    _dark={{
                      bg: 'var(--input-bg-dark)',
                      color: 'var(--text-color-dark)',
                    }}
                  >
                    <SummaryPanel
                      summary={summary}
                      editingSummary={editingSummary}
                      setEditingSummary={setEditingSummary}
                      setSummary={setSummary}
                      formatMeetingNoteForDisplay={(noteText) =>
                        formatMeetingNoteForDisplay(
                          noteText,
                          headingColor,
                          subHeadingColor,
                          textColor,
                          borderColor,
                        )
                      }
                    />
                  </TabPanel>
                  <TabPanel
                    p={4}
                    color="var(--text-color-light)"
                    _dark={{
                      bg: 'var(--input-bg-dark)',
                      color: 'var(--text-color-dark)',
                    }}
                  >
                    <NotesPanel
                      notes={notes}
                      editingNotes={editingNotes}
                      setEditingNotes={setEditingNotes}
                      setNotes={setNotes}
                    />
                  </TabPanel>
                  <TabPanel p={4}>
                    <ChatPanel
                      chatMessages={chatMessages}
                      chatInput={chatInput}
                      setChatInput={setChatInput}
                      handleSendChat={handleSendChat}
                      isWaitingBot={isWaitingBot}
                      chatEndRef={chatEndRef}
                      chatBg={chatBg}
                      chatPanelBorder={chatPanelBorder}
                      chatText={chatText}
                      chatUserBg={chatUserBg}
                      chatUserColor={chatUserColor}
                      chatBotBg={chatBotBg}
                      chatBotColor={chatBotColor}
                      chatInputBg={chatInputBg}
                      chatInputBorder={chatInputBorder}
                      chatInputColor={chatInputColor}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              ''
            )}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default RecordingDetailView;

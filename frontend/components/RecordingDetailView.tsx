import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  Badge,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaInbox,
  FaStar,
  FaEdit,
  FaRedoAlt,
  FaSyncAlt,
  FaUndo,
  FaUserTag,
  FaShareAlt,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaCalendar,
  FaCopy,
  FaRobot,
  FaPaperPlane,
} from 'react-icons/fa';
import SimpleMarkDownEditor from './SimpleMarkDownEditor';

interface RecordingDetailViewProps {
  selectedRecording: any;
  onToggleInbox?: () => void;
  onToggleHighlight?: () => void;
  onEdit?: () => void;
  onReprocessTranscription?: () => void;
  onReprocessSummary?: () => void;
  onReset?: () => void;
  onSpeakerModal?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

const RecordingDetailView: React.FC<RecordingDetailViewProps> = ({
  selectedRecording,
  onToggleInbox,
  onToggleHighlight,
  onEdit,
  onReprocessTranscription,
  onReprocessSummary,
  onReset,
  onSpeakerModal,
  onShare,
  onDelete,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [metaOpen, setMetaOpen] = useState(false);
  const [tab, setTab] = useState('transcript');
  // Mock state for edit, chat, etc.
  const [editingSummary, setEditingSummary] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [summary, setSummary] = useState(selectedRecording?.summary || '');
  const [notes, setNotes] = useState(selectedRecording?.notes || '');
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

  const handleSendChat = async () => {
    if (!chatInput.trim() || isWaitingBot) return;
    setChatMessages((msgs) => [...msgs, { role: 'user', content: chatInput }]);
    setChatInput('');
    setIsWaitingBot(true);
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        { role: 'bot', content: 'Đây là phản hồi từ bot.' },
      ]);
      setIsWaitingBot(false);
    }, 500);
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

  /**
   * Formats meeting note markdown for display
   * @param noteText Raw meeting note markdown text
   * @returns HTML string with styled markdown
   */
  const formatMeetingNoteForDisplay = (noteText: string): string => {
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
        let bullet =
          '<span style="display:inline-block;width:6px;height:6px;margin-right:8px;margin-top:6px;background:' +
          borderColor +
          ';border-radius:50%"></span>';
        let margin = indentLevel >= 6 ? 40 : indentLevel >= 4 ? 28 : 20;
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
        {/* Mobile Header */}
        <Box
          bg="var(--input-bg-light)"
          _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
          borderBottom="1px solid"
          borderColor="gray.200"
          p={4}
          flexShrink={0}
          borderRadius="0 0 1.5rem 1.5rem"
          boxShadow="0 2px 8px 0 rgba(0,0,0,0.04)"
        >
          <Box onClick={() => setMetaOpen((v) => !v)} cursor="pointer">
            <Flex align="start" justify="space-between">
              <Box flex="1" minW={0}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="var(--text-color-light)"
                  _dark={{ color: 'var(--text-color-dark)' }}
                  isTruncated
                >
                  {selectedRecording.title ||
                    selectedRecording.filename ||
                    'Untitled Recording'}
                </Text>
                <Text
                  fontSize="sm"
                  color="var(--text-color-light)"
                  _dark={{ color: 'var(--text-color-dark)' }}
                  isTruncated
                >
                  {selectedRecording.original_filename ||
                    'No original filename'}
                </Text>
              </Box>
              <Box as={metaOpen ? FaChevronUp : FaChevronDown} fontSize="lg" />
            </Flex>
          </Box>
          {metaOpen && (
            <Box mt={4}>
              <Flex
                align="center"
                gap={2}
                color="var(--text-color-light)"
                _dark={{ color: 'var(--text-color-dark)' }}
                fontSize="sm"
              >
                <FaCalendar color="#0070f3" />
                <span>
                  {selectedRecording.created_at
                    ? new Date(selectedRecording.created_at).toLocaleString()
                    : 'No date set'}
                </span>
              </Flex>
              <Flex align="center" gap={2} mt={2}>
                {selectedRecording.status &&
                  selectedRecording.status !== 'COMPLETED' && (
                    <Badge
                      colorScheme="yellow"
                      borderRadius="xl"
                      px={2}
                      py={1}
                      fontSize="xs"
                    >
                      {selectedRecording.status}
                    </Badge>
                  )}
              </Flex>
              {/* Action Buttons */}
              <Flex gap={2} mt={4} wrap="wrap">
                <IconButton
                  aria-label="Inbox"
                  icon={<FaInbox />}
                  onClick={onToggleInbox}
                  color={selectedRecording.is_inbox ? '#0070f3' : undefined}
                />
                <IconButton
                  aria-label="Star"
                  icon={<FaStar />}
                  onClick={onToggleHighlight}
                  color={
                    selectedRecording.is_highlighted ? '#ffd600' : undefined
                  }
                />
                <IconButton
                  aria-label="Edit"
                  icon={<FaEdit />}
                  onClick={onEdit}
                />
                <IconButton
                  aria-label="Reprocess"
                  icon={<FaRedoAlt />}
                  onClick={onReprocessTranscription}
                />
                <IconButton
                  aria-label="Summary"
                  icon={<FaSyncAlt />}
                  onClick={onReprocessSummary}
                />
                <IconButton
                  aria-label="Reset"
                  icon={<FaUndo />}
                  onClick={onReset}
                  color="#ff9800"
                />
                <IconButton
                  aria-label="Speaker"
                  icon={<FaUserTag />}
                  onClick={onSpeakerModal}
                />
                <IconButton
                  aria-label="Share"
                  icon={<FaShareAlt />}
                  onClick={onShare}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<FaTrash />}
                  onClick={onDelete}
                  color="#f44336"
                />
              </Flex>
            </Box>
          )}
        </Box>
        {/* Main Content Mobile: Audio + Tabs */}
        <Box
          height="calc(100vh - 100px)"
          minH={0}
          maxH="calc(100vh - 100px)"
          display="flex"
          flexDirection="column"
          bg="var(--input-bg-light)"
          _dark={{ bg: 'var(--input-bg-dark)' }}
        >
          <Box
            bg="var(--input-bg-light)"
            _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
            p={4}
            borderBottom="1px solid"
            borderColor="#aaa"
            flexShrink={0}
          >
            <audio
              controls
              src={selectedRecording.audio_path || ''}
              style={{ width: '100%' }}
            >
              <track kind="captions" src="" label="No captions" default />
            </audio>
            <Flex
              mt={2}
              gap={4}
              color="var(--text-color-light)"
              _dark={{ color: 'var(--text-color-dark)' }}
              fontSize="sm"
            >
              {selectedRecording.duration !== undefined && (
                <Box>
                  <strong>Duration:</strong> {selectedRecording.duration}s
                </Box>
              )}
              {selectedRecording.file_size !== undefined && (
                <Box>
                  <strong>Size:</strong> {selectedRecording.file_size} bytes
                </Box>
              )}
            </Flex>
          </Box>
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
                {/* Transcript Panel */}
                {(() => {
                  const t = selectedRecording.transcription;
                  if (Array.isArray(t)) {
                    return (
                      <ParseTranscriptToHtml
                        transcriptArr={t}
                        textColor={textColor}
                        borderColor={borderColor}
                      />
                    );
                  }
                  if (typeof t === 'string') {
                    let arr = null;
                    let cleaned = t
                      .replace(/\n/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim();
                    if (!cleaned.startsWith('[')) cleaned = '[' + cleaned;
                    if (!cleaned.endsWith(']')) cleaned = cleaned + ']';
                    cleaned = cleaned.replace(/'/g, '"');
                    arr = JSON.parse(cleaned);
                    if (Array.isArray(arr)) {
                      return (
                        <ParseTranscriptToHtml
                          transcriptArr={arr}
                          textColor={textColor}
                          borderColor={borderColor}
                        />
                      );
                    }
                    return (
                      <Text
                        color="var(--text-color-light)"
                        _dark={{ color: 'var(--text-color-dark)' }}
                      >
                        {'No transcription available.'}
                      </Text>
                    );
                  }
                  return (
                    <Text
                      color="var(--text-color-light)"
                      _dark={{ color: 'var(--text-color-dark)' }}
                    >
                      No transcription available.
                    </Text>
                  );
                })()}
              </TabPanel>
              <TabPanel
                p={4}
                color="var(--text-color-light)"
                _dark={{
                  bg: 'var(--input-bg-dark)',
                  color: 'var(--text-color-dark)',
                }}
              >
                {/* Summary Panel */}
                {editingSummary ? (
                  <Box>
                    <SimpleMarkDownEditor
                      initialValue={summary}
                      onChange={setSummary}
                      mode="edit"
                      height="45vh"
                      placeholder="Nhập tóm tắt dạng markdown..."
                    />
                    <Flex justify="end" gap={2} mt={2}>
                      <Button
                        size="sm"
                        onClick={() => setEditingSummary(false)}
                        bg="#eee"
                        color="#1a202c"
                        borderRadius="xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        bg="#0070f3"
                        color="#fff"
                        borderRadius="xl"
                        onClick={() => setEditingSummary(false)}
                        _hover={{ bg: '#339dff' }}
                      >
                        Save
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      size="sm"
                      leftIcon={<FaEdit />}
                      onClick={() => setEditingSummary(true)}
                      mb={2}
                      bg="#0070f3"
                      color="#fff"
                      borderRadius="xl"
                      _hover={{ bg: '#339dff' }}
                    >
                      Edit
                    </Button>
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: formatMeetingNoteForDisplay(summary),
                      }}
                    />
                  </Box>
                )}
              </TabPanel>
              <TabPanel
                p={4}
                color="var(--text-color-light)"
                _dark={{
                  bg: 'var(--input-bg-dark)',
                  color: 'var(--text-color-dark)',
                }}
              >
                {/* Notes Panel */}
                {editingNotes ? (
                  <Box>
                    <SimpleMarkDownEditor
                      initialValue={notes}
                      onChange={setNotes}
                      mode="edit"
                      height="200px"
                      placeholder="Nhập ghi chú dạng markdown..."
                    />
                    <Flex justify="end" gap={2} mt={2}>
                      <Button
                        size="sm"
                        onClick={() => setEditingNotes(false)}
                        bg="#eee"
                        color="#1a202c"
                        borderRadius="xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        bg="#0070f3"
                        color="#fff"
                        borderRadius="xl"
                        onClick={() => setEditingNotes(false)}
                        _hover={{ bg: '#339dff' }}
                      >
                        Save
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      size="sm"
                      leftIcon={<FaEdit />}
                      onClick={() => setEditingNotes(true)}
                      mb={2}
                      bg="#0070f3"
                      color="#fff"
                      borderRadius="xl"
                      _hover={{ bg: '#339dff' }}
                    >
                      Edit
                    </Button>
                    <Box>
                      {notes || (
                        <Text
                          color="var(--text-color-light)"
                          _dark={{ color: 'var(--text-color-dark)' }}
                        >
                          No notes available
                        </Text>
                      )}
                    </Box>
                  </Box>
                )}
              </TabPanel>
              <TabPanel p={4}>
                <Flex
                  direction="column"
                  h="55vh"
                  bg={chatBg}
                  borderRadius="xl"
                  boxShadow="sm"
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor={chatPanelBorder}
                >
                  <Box flex="1" overflowY="auto" p={4} bg={chatBg}>
                    {chatMessages.length === 0 ? (
                      <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        h="100%"
                        color={chatText}
                      >
                        <FaRobot size={32} />
                        <Text mt={2}>
                          Ask questions about this transcription
                        </Text>
                      </Flex>
                    ) : (
                      <>
                        {chatMessages.map((msg, idx) => (
                          <Box
                            key={idx}
                            mb={3}
                            p={2}
                            bg={msg.role === 'user' ? chatUserBg : chatBotBg}
                            color={
                              msg.role === 'user' ? chatUserColor : chatBotColor
                            }
                            alignSelf={
                              msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }
                            borderRadius="lg"
                            maxW="80%"
                            textAlign={msg.role === 'user' ? 'right' : 'left'}
                            fontSize="md"
                            boxShadow="xs"
                          >
                            {msg.content}
                          </Box>
                        ))}
                        <div ref={chatEndRef} />
                      </>
                    )}
                  </Box>
                  <Flex
                    p={4}
                    gap={2}
                    borderTop="1px solid"
                    borderColor={chatPanelBorder}
                  >
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about this transcription..."
                      flex="1"
                      rows={1}
                      resize="none"
                      borderRadius="xl"
                      bg={chatInputBg}
                      color={chatInputColor}
                      borderColor={chatInputBorder}
                      _focus={{ borderColor: '#0070f3', bg: chatInputBg }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChat();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendChat}
                      leftIcon={<FaPaperPlane />}
                      bg="#0070f3"
                      color="white"
                      borderRadius="xl"
                      _hover={{ bg: '#339dff' }}
                      disabled={isWaitingBot}
                    >
                      Send
                    </Button>
                  </Flex>
                </Flex>
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
      {/* Header */}
      <Box
        bg="var(--input-bg-light)"
        _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
        borderBottom="1px solid"
        borderColor="gray.200"
        p={6}
        flexShrink={0}
        borderRadius="0 0 1.5rem 1.5rem"
        boxShadow="0 2px 8px 0 rgba(0,0,0,0.04)"
      >
        <Flex align="start" justify="space-between">
          <Box flex="1" minW={0}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="var(--text-color-light)"
              _dark={{ color: 'var(--text-color-dark)' }}
              mb={2}
            >
              {selectedRecording.title ||
                selectedRecording.filename ||
                'Untitled Recording'}
            </Text>
          </Box>
          <Flex gap={2} ml={4} wrap="wrap">
            <IconButton
              aria-label="Inbox"
              icon={<FaInbox />}
              onClick={onToggleInbox}
              color={selectedRecording.is_inbox ? '#0070f3' : undefined}
            />
            <IconButton
              aria-label="Star"
              icon={<FaStar />}
              onClick={onToggleHighlight}
              color={selectedRecording.is_highlighted ? '#ffd600' : undefined}
            />
            <IconButton aria-label="Edit" icon={<FaEdit />} onClick={onEdit} />
            <IconButton
              aria-label="Reprocess"
              icon={<FaRedoAlt />}
              onClick={onReprocessTranscription}
            />
            <IconButton
              aria-label="Summary"
              icon={<FaSyncAlt />}
              onClick={onReprocessSummary}
            />
            <IconButton
              aria-label="Reset"
              icon={<FaUndo />}
              onClick={onReset}
              color="#ff9800"
            />
            <IconButton
              aria-label="Speaker"
              icon={<FaUserTag />}
              onClick={onSpeakerModal}
            />
            <IconButton
              aria-label="Share"
              icon={<FaShareAlt />}
              onClick={onShare}
            />
            <IconButton
              aria-label="Delete"
              icon={<FaTrash />}
              onClick={onDelete}
              color="#f44336"
            />
          </Flex>
        </Flex>
        {/* Metadata Row */}
        <Flex
          flexWrap="wrap"
          align="center"
          gap={6}
          fontSize="sm"
          color="var(--text-color-light)"
          _dark={{ color: 'var(--text-color-dark)' }}
          mt={2}
        >
          <Flex align="center" gap={2}>
            <FaUsers color="#0070f3" />
            {selectedRecording.original_filename || 'No original filename'}
          </Flex>
          <Flex align="center" gap={2}>
            <FaCalendar color="#0070f3" />
            {selectedRecording.created_at
              ? new Date(selectedRecording.created_at).toLocaleString()
              : 'No date set'}
          </Flex>
          {selectedRecording.status &&
            selectedRecording.status !== 'COMPLETED' && (
              <Badge
                colorScheme="yellow"
                borderRadius="xl"
                px={2}
                py={1}
                fontSize="xs"
              >
                {selectedRecording.status}
              </Badge>
            )}
        </Flex>
      </Box>
      {/* Main Content Split View */}
      <Box
        height="calc(100vh - 230px)"
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
              <Flex gap={2}>
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
              </Flex>
            </Box>
            <Box
              flex="1"
              overflowY="auto"
              p={4}
              minH={0}
              bg="var(--input-bg-light)"
              _dark={{ bg: 'var(--input-bg-dark)' }}
            >
              {(() => {
                const t = selectedRecording.transcription;
                if (Array.isArray(t)) {
                  return (
                    <ParseTranscriptToHtml
                      transcriptArr={t}
                      textColor={textColor}
                      borderColor={borderColor}
                    />
                  );
                }
                if (typeof t === 'string') {
                  let arr = null;
                  let cleaned = t
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                  if (!cleaned.startsWith('[')) cleaned = '[' + cleaned;
                  if (!cleaned.endsWith(']')) cleaned = cleaned + ']';
                  cleaned = cleaned.replace(/'/g, '"');
                  arr = JSON.parse(cleaned);
                  if (Array.isArray(arr)) {
                    return (
                      <ParseTranscriptToHtml
                        transcriptArr={arr}
                        textColor={textColor}
                        borderColor={borderColor}
                      />
                    );
                  }
                  return (
                    <Text
                      color="var(--text-color-light)"
                      _dark={{ color: 'var(--text-color-dark)' }}
                    >
                      {'No transcription available.'}
                    </Text>
                  );
                }
                return (
                  <Text
                    color="var(--text-color-light)"
                    _dark={{ color: 'var(--text-color-dark)' }}
                  >
                    No transcription available.
                  </Text>
                );
              })()}
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
            {/* Audio Player */}
            <Box
              bg="var(--input-bg-light)"
              _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
              p={4}
              borderBottom="1px solid"
              borderColor="#eee"
            >
              <audio
                controls
                src={selectedRecording.audio_path || ''}
                style={{ width: '100%' }}
              >
                <track kind="captions" src="" label="No captions" default />
              </audio>
              <Flex
                mt={2}
                gap={4}
                color="var(--text-color-light)"
                _dark={{ color: 'var(--text-color-dark)' }}
                fontSize="sm"
              >
                {selectedRecording.duration !== undefined && (
                  <Box>
                    <strong>Duration:</strong> {selectedRecording.duration}s
                  </Box>
                )}
                {selectedRecording.file_size !== undefined && (
                  <Box>
                    <strong>Size:</strong> {selectedRecording.file_size} bytes
                  </Box>
                )}
              </Flex>
            </Box>
            {/* Tabs */}
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
                  {/* Summary Panel */}
                  {editingSummary ? (
                    <Box>
                      <SimpleMarkDownEditor
                        initialValue={summary}
                        onChange={setSummary}
                        mode="edit"
                        height="50vh"
                        placeholder="Nhập tóm tắt dạng markdown..."
                      />
                      <Flex justify="end" gap={2} mt={2}>
                        <Button
                          size="sm"
                          onClick={() => setEditingSummary(false)}
                          bg="#eee"
                          color="#1a202c"
                          borderRadius="xl"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          bg="#0070f3"
                          color="#fff"
                          borderRadius="xl"
                          onClick={() => setEditingSummary(false)}
                          _hover={{ bg: '#339dff' }}
                        >
                          Save
                        </Button>
                      </Flex>
                    </Box>
                  ) : (
                    <Box>
                      <Button
                        size="sm"
                        leftIcon={<FaEdit />}
                        onClick={() => setEditingSummary(true)}
                        mb={2}
                        bg="#0070f3"
                        color="#fff"
                        borderRadius="xl"
                        _hover={{ bg: '#339dff' }}
                      >
                        Edit
                      </Button>
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: formatMeetingNoteForDisplay(summary),
                        }}
                      />
                    </Box>
                  )}
                </TabPanel>
                <TabPanel
                  p={4}
                  color="var(--text-color-light)"
                  _dark={{
                    bg: 'var(--input-bg-dark)',
                    color: 'var(--text-color-dark)',
                  }}
                >
                  {/* Notes Panel */}
                  {editingNotes ? (
                    <Box>
                      <SimpleMarkDownEditor
                        initialValue={notes}
                        onChange={setNotes}
                        mode="edit"
                        height="200px"
                        placeholder="Nhập ghi chú dạng markdown..."
                      />
                      <Flex justify="end" gap={2} mt={2}>
                        <Button
                          size="sm"
                          onClick={() => setEditingNotes(false)}
                          bg="#eee"
                          color="#1a202c"
                          borderRadius="xl"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          bg="#0070f3"
                          color="#fff"
                          borderRadius="xl"
                          onClick={() => setEditingNotes(false)}
                          _hover={{ bg: '#339dff' }}
                        >
                          Save
                        </Button>
                      </Flex>
                    </Box>
                  ) : (
                    <Box>
                      <Button
                        size="sm"
                        leftIcon={<FaEdit />}
                        onClick={() => setEditingNotes(true)}
                        mb={2}
                        bg="#0070f3"
                        color="#fff"
                        borderRadius="xl"
                        _hover={{ bg: '#339dff' }}
                      >
                        Edit
                      </Button>
                      <Box>
                        {notes || (
                          <Text
                            color="var(--text-color-light)"
                            _dark={{ color: 'var(--text-color-dark)' }}
                          >
                            No notes available
                          </Text>
                        )}
                      </Box>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={4}>
                  <Flex
                    direction="column"
                    h="60vh"
                    bg={chatBg}
                    borderRadius="xl"
                    boxShadow="sm"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor={chatPanelBorder}
                  >
                    <Box flex="1" overflowY="auto" p={4} bg={chatBg}>
                      {chatMessages.length === 0 ? (
                        <Flex
                          direction="column"
                          align="center"
                          justify="center"
                          h="100%"
                          color={chatText}
                        >
                          <FaRobot size={32} />
                          <Text mt={2}>
                            Ask questions about this transcription
                          </Text>
                        </Flex>
                      ) : (
                        <>
                          {chatMessages.map((msg, idx) => (
                            <Flex
                              key={idx}
                              justify={
                                msg.role === 'user' ? 'flex-end' : 'flex-start'
                              }
                            >
                              <Box
                                mb={3}
                                p={2}
                                bg={
                                  msg.role === 'user' ? chatUserBg : chatBotBg
                                }
                                color={
                                  msg.role === 'user'
                                    ? chatUserColor
                                    : chatBotColor
                                }
                                borderRadius="lg"
                                maxW="80%"
                                textAlign={
                                  msg.role === 'user' ? 'right' : 'left'
                                }
                                fontSize="md"
                                boxShadow="xs"
                              >
                                {msg.content}
                              </Box>
                            </Flex>
                          ))}
                          <div ref={chatEndRef} />
                        </>
                      )}
                    </Box>
                    <Flex
                      p={4}
                      gap={2}
                      borderTop="1px solid"
                      borderColor={chatPanelBorder}
                    >
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask about this transcription..."
                        flex="1"
                        rows={1}
                        resize="none"
                        borderRadius="xl"
                        bg={chatInputBg}
                        color={chatInputColor}
                        borderColor={chatInputBorder}
                        _focus={{ borderColor: '#0070f3', bg: chatInputBg }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendChat}
                        leftIcon={<FaPaperPlane />}
                        bg="#0070f3"
                        color="white"
                        borderRadius="xl"
                        _hover={{ bg: '#339dff' }}
                        disabled={isWaitingBot}
                      >
                        Send
                      </Button>
                    </Flex>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

// Parse transcript array to HTML
function ParseTranscriptToHtml({
  transcriptArr,
  textColor,
  borderColor,
}: {
  transcriptArr: any[];
  textColor: string;
  borderColor: string;
}) {
  if (!Array.isArray(transcriptArr)) return null;
  // Tạo màu cho từng speaker
  const speakerColors = [
    '#0070f3',
    '#ff9800',
    '#43a047',
    '#d81b60',
    '#6d4cff',
    '#00897b',
  ];
  const speakerMap: Record<string, string> = {};
  let colorIdx = 0;
  transcriptArr.forEach((item) => {
    if (!speakerMap[item.speaker]) {
      speakerMap[item.speaker] = speakerColors[colorIdx % speakerColors.length];
      colorIdx++;
    }
  });
  return (
    <div style={{ lineHeight: 1.8 }}>
      {transcriptArr.map((item, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 4,
            padding: '6px 0',
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'flex-start',
            color: textColor,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: speakerMap[item.speaker],
              marginRight: 12,
              minWidth: 110,
              display: 'inline-block',
            }}
          >
            {item.speaker}:
          </span>
          <span style={{ color: textColor, fontSize: 16 }}>
            {item.sentence}
          </span>
        </div>
      ))}
    </div>
  );
}

export default RecordingDetailView;

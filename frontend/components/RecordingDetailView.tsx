import React, { useState } from 'react';
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
  FaFileAlt,
} from 'react-icons/fa';

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

  // Mobile View
  if (isMobile) {
    return (
      <Flex
        flex="1"
        direction="column"
        overflow="hidden"
        bg="#fff"
        minH="100vh"
      >
        {/* Mobile Header */}
        <Box
          bg="#f7fafc"
          borderBottom="1px solid #e5e7eb"
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
                  color="#1a202c"
                  isTruncated
                >
                  {selectedRecording.title ||
                    selectedRecording.filename ||
                    'Untitled Recording'}
                </Text>
                <Text fontSize="sm" color="#888" isTruncated>
                  {selectedRecording.original_filename ||
                    'No original filename'}
                </Text>
              </Box>
              <Box as={metaOpen ? FaChevronUp : FaChevronDown} fontSize="lg" />
            </Flex>
          </Box>
          {metaOpen && (
            <Box mt={4}>
              <Flex align="center" gap={2} color="#888" fontSize="sm">
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
        {/* Audio Player */}
        <Box bg="#f7fafc" p={4} borderBottom="1px solid #e5e7eb" flexShrink={0}>
          <audio
            controls
            src={selectedRecording.audio_path || ''}
            style={{ width: '100%' }}
          >
            <track kind="captions" src="" label="No captions" default />
          </audio>
          <Flex mt={2} gap={4} color="#888" fontSize="sm">
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
          index={['transcript', 'summary', 'notes', 'chat'].indexOf(tab)}
          onChange={(i) =>
            setTab(['transcript', 'summary', 'notes', 'chat'][i])
          }
        >
          <TabList
            bg="#f0f4fa"
            borderBottom="1px solid #e5e7eb"
            borderRadius="xl"
            px={2}
          >
            <Tab _selected={{ bg: '#0070f3', color: '#fff' }} borderRadius="xl">
              Transcript
            </Tab>
            <Tab _selected={{ bg: '#0070f3', color: '#fff' }} borderRadius="xl">
              Summary
            </Tab>
            <Tab _selected={{ bg: '#0070f3', color: '#fff' }} borderRadius="xl">
              Notes
            </Tab>
            <Tab _selected={{ bg: '#0070f3', color: '#fff' }} borderRadius="xl">
              Chat
            </Tab>
          </TabList>
          <TabPanels
            flex="1"
            overflowY="auto"
            bg="#fff"
            borderRadius="xl"
            boxShadow="0 2px 8px 0 rgba(0,0,0,0.04)"
            mt={2}
          >
            <TabPanel p={4}>
              {/* Transcript Panel */}
              {(() => {
                const t = selectedRecording.transcription;
                if (Array.isArray(t)) {
                  console.log('transcription is array:', t);
                  return parseTranscriptToHtml(t);
                }
                if (typeof t === 'string') {
                  let arr = null;
                  // Làm sạch chuỗi
                  let cleaned = t
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                  if (!cleaned.startsWith('[')) cleaned = '[' + cleaned;
                  if (!cleaned.endsWith(']')) cleaned = cleaned + ']';
                  cleaned = cleaned.replace(/'/g, '"');
                  console.log('transcription cleaned:', cleaned);
                  try {
                    arr = JSON.parse(cleaned);
                    console.log('transcription parsed JSON after clean:', arr);
                  } catch (e1) {
                    console.log('JSON.parse after clean failed', e1);
                    try {
                      // eslint-disable-next-line no-eval
                      arr = eval(cleaned);
                      console.log('transcription parsed eval:', arr);
                    } catch (e2) {
                      console.log('eval failed', e2);
                    }
                  }
                  console.log(
                    'transcription parsed: is array true',
                    Array.isArray(arr),
                  );
                  if (Array.isArray(arr)) {
                    console.log(
                      'transcription parsed: parseTranscriptToHtml',
                      parseTranscriptToHtml(arr),
                    );
                    return parseTranscriptToHtml(arr);
                  }
                  return (
                    <Text color="#888">{'No transcription available.'}</Text>
                  );
                }
                return <Text color="#888">No transcription available.</Text>;
              })()}
            </TabPanel>
            <TabPanel p={4}>
              {/* Summary Panel */}
              {editingSummary ? (
                <Box>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    borderRadius="xl"
                    bg="#f7fafc"
                    color="#1a202c"
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
                  <Box>
                    {summary || <Text color="#888">No summary available</Text>}
                  </Box>
                </Box>
              )}
            </TabPanel>
            <TabPanel p={4}>
              {/* Notes Panel */}
              {editingNotes ? (
                <Box>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    borderRadius="xl"
                    bg="#f7fafc"
                    color="#1a202c"
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
                    {notes || <Text color="#888">No notes available</Text>}
                  </Box>
                </Box>
              )}
            </TabPanel>
            <TabPanel p={4}>
              {/* Chat Panel */}
              <Box flex="1" overflowY="auto">
                {chatMessages.length === 0 ? (
                  <Flex direction="column" align="center" py={8} color="#888">
                    <FaRobot size={32} />
                    <Text>Ask questions about this transcription</Text>
                  </Flex>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <Box
                      key={idx}
                      className={
                        msg.role === 'user' ? 'user-message' : 'ai-message'
                      }
                    >
                      {msg.content}
                    </Box>
                  ))
                )}
                {/* Chat input */}
                <Flex gap={2} mt={4}>
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    rows={2}
                    size="sm"
                    placeholder="Ask about this transcription..."
                    borderRadius="xl"
                    bg="#f7fafc"
                    color="#1a202c"
                  />
                  <Button
                    leftIcon={<FaPaperPlane />}
                    bg="#0070f3"
                    color="#fff"
                    borderRadius="xl"
                    _hover={{ bg: '#339dff' }}
                    onClick={() =>
                      setChatMessages((msgs) => [
                        ...msgs,
                        { role: 'user', content: chatInput },
                      ])
                    }
                  >
                    Send
                  </Button>
                </Flex>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    );
  }

  // Desktop View
  return (
    <Flex flex="1" direction="column" overflow="hidden" bg="#fff" minH="100vh - 120px">
      {/* Header */}
      <Box
        bg="#f7fafc"
        borderBottom="1px solid #e5e7eb"
        p={6}
        flexShrink={0}
        borderRadius="0 0 1.5rem 1.5rem"
        boxShadow="0 2px 8px 0 rgba(0,0,0,0.04)"
      >
        <Flex align="start" justify="space-between">
          <Box flex="1" minW={0}>
            <Text fontSize="2xl" fontWeight="bold" color="#1a202c" mb={2}>
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
          color="#888"
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
      <Box height="calc(100vh - 230px)" minH={0}>
        <Flex flex="1" height="100%" minH={0} overflow="hidden">
          {/* Left Panel: Transcript */}
          <Box
            flex="1"
            minW={0}
            display="flex"
            flexDirection="column"
            borderRight="1px solid #e5e7eb"
            height="100%"
            minH={0}
          >
            <Box
              bg="#f0f4fa"
              h="60px"
              px={4}
              py={3}
              borderBottom="1px solid #e5e7eb"
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
            <Box flex="1" overflowY="auto" p={4} minH={0}>
              {(() => {
                const t = selectedRecording.transcription;
                if (Array.isArray(t)) {
                  return parseTranscriptToHtml(t);
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
                  try {
                    arr = JSON.parse(cleaned);
                  } catch (e1) {
                    try {
                      // eslint-disable-next-line no-eval
                      arr = eval(cleaned);
                    } catch (e2) {}
                  }
                  if (Array.isArray(arr)) {
                    return parseTranscriptToHtml(arr);
                  }
                  return (
                    <Text color="#888">{'No transcription available.'}</Text>
                  );
                }
                return <Text color="#888">No transcription available.</Text>;
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
          >
            {/* Audio Player */}
            <Box bg="#f7fafc" p={4} borderBottom="1px solid #e5e7eb">
              <audio
                controls
                src={selectedRecording.audio_path || ''}
                style={{ width: '100%' }}
              >
                <track kind="captions" src="" label="No captions" default />
              </audio>
              <Flex mt={2} gap={4} color="#888" fontSize="sm">
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
            >
              <TabList
                bg="#f0f4fa"
                borderBottom="1px solid #e5e7eb"
                borderRadius="xl"
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
              <TabPanels flex="1" overflowY="auto" minH={0}>
                <TabPanel p={4}>
                  {/* Summary Panel */}
                  {editingSummary ? (
                    <Box>
                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        borderRadius="xl"
                        bg="#f7fafc"
                        color="#1a202c"
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
                      <Box>
                        {summary || (
                          <Text color="#888">No summary available</Text>
                        )}
                      </Box>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={4}>
                  {/* Notes Panel */}
                  {editingNotes ? (
                    <Box>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        borderRadius="xl"
                        bg="#f7fafc"
                        color="#1a202c"
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
                        {notes || <Text color="#888">No notes available</Text>}
                      </Box>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={4}>
                  {/* Chat Panel */}
                  <Box flex="1" overflowY="auto">
                    {chatMessages.length === 0 ? (
                      <Flex
                        direction="column"
                        align="center"
                        py={8}
                        color="#888"
                      >
                        <FaRobot size={32} />
                        <Text>Ask questions about this transcription</Text>
                      </Flex>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <Box
                          key={idx}
                          className={
                            msg.role === 'user' ? 'user-message' : 'ai-message'
                          }
                        >
                          {msg.content}
                        </Box>
                      ))
                    )}
                    {/* Chat input */}
                    <Flex gap={2} mt={4}>
                      <Textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        rows={2}
                        size="sm"
                        placeholder="Ask about this transcription..."
                        borderRadius="xl"
                        bg="#f7fafc"
                        color="#1a202c"
                      />
                      <Button
                        leftIcon={<FaPaperPlane />}
                        bg="#0070f3"
                        color="#fff"
                        borderRadius="xl"
                        _hover={{ bg: '#339dff' }}
                        onClick={() =>
                          setChatMessages((msgs) => [
                            ...msgs,
                            { role: 'user', content: chatInput },
                          ])
                        }
                      >
                        Send
                      </Button>
                    </Flex>
                  </Box>
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
function parseTranscriptToHtml(transcriptArr: any[]) {
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
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'flex-start',
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
          <span style={{ color: '#222', fontSize: 16 }}>{item.sentence}</span>
        </div>
      ))}
    </div>
  );
}

export default RecordingDetailView;

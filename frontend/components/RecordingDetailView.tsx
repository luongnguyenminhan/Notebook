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
  Input,
  Textarea,
  Divider,
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
  const [showChat, setShowChat] = useState(false);

  if (!selectedRecording) return null;

  // Mobile View
  if (isMobile) {
    return (
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Mobile Header */}
        <Box
          bg="var(--bg-secondary)"
          borderBottom="1px"
          borderColor="var(--border-primary)"
          p={4}
          flexShrink={0}
        >
          <Box onClick={() => setMetaOpen((v) => !v)} cursor="pointer">
            <Flex align="start" justify="space-between">
              <Box flex="1" minW={0}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="var(--text-primary)"
                  isTruncated
                >
                  {selectedRecording.title || 'Untitled Recording'}
                </Text>
                <Text fontSize="sm" color="var(--text-muted)" isTruncated>
                  {selectedRecording.participants || 'No participants'}
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
                color="var(--text-muted)"
                fontSize="sm"
              >
                <FaCalendar color="var(--text-accent)" />
                <span>{selectedRecording.meeting_date || 'No date set'}</span>
              </Flex>
              <Flex align="center" gap={2} mt={2}>
                {selectedRecording.status !== 'COMPLETED' && (
                  <Badge colorScheme="yellow">{selectedRecording.status}</Badge>
                )}
              </Flex>
              {/* Action Buttons */}
              <Flex gap={2} mt={4} wrap="wrap">
                <IconButton
                  aria-label="Inbox"
                  icon={<FaInbox />}
                  onClick={onToggleInbox}
                  color={selectedRecording.is_inbox ? 'blue.500' : undefined}
                />
                <IconButton
                  aria-label="Star"
                  icon={<FaStar />}
                  onClick={onToggleHighlight}
                  color={
                    selectedRecording.is_highlighted ? 'yellow.500' : undefined
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
                  color="orange.500"
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
                  color="red.500"
                />
              </Flex>
            </Box>
          )}
        </Box>
        {/* Audio Player */}
        <Box
          bg="var(--bg-secondary)"
          p={4}
          borderBottom="1px"
          borderColor="var(--border-primary)"
          flexShrink={0}
        >
          <audio
            controls
            src={selectedRecording.audioUrl || ''}
            style={{ width: '100%' }}
          />
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
            bg="var(--bg-tertiary)"
            borderBottom="1px"
            borderColor="var(--border-primary)"
          >
            <Tab>Transcript</Tab>
            <Tab>Summary</Tab>
            <Tab>Notes</Tab>
            <Tab>Chat</Tab>
          </TabList>
          <TabPanels flex="1" overflowY="auto">
            <TabPanel p={4}>
              {/* Transcript Panel */}
              <Text color="gray.400">Transcript content here...</Text>
            </TabPanel>
            <TabPanel p={4}>
              {/* Summary Panel */}
              {editingSummary ? (
                <Box>
                  <Textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                  <Flex justify="end" gap={2} mt={2}>
                    <Button size="sm" onClick={() => setEditingSummary(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => setEditingSummary(false)}
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
                  >
                    Edit
                  </Button>
                  <Box>
                    {summary || (
                      <Text color="gray.400">No summary available</Text>
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
                  />
                  <Flex justify="end" gap={2} mt={2}>
                    <Button size="sm" onClick={() => setEditingNotes(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => setEditingNotes(false)}
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
                  >
                    Edit
                  </Button>
                  <Box>
                    {notes || <Text color="gray.400">No notes available</Text>}
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
                    color="gray.400"
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
                  />
                  <Button
                    leftIcon={<FaPaperPlane />}
                    colorScheme="blue"
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
    <Flex flex="1" direction="column" overflow="hidden">
      {/* Header */}
      <Box
        bg="var(--bg-secondary)"
        borderBottom="1px"
        borderColor="var(--border-primary)"
        p={6}
        flexShrink={0}
      >
        <Flex align="start" justify="space-between">
          <Box flex="1" minW={0}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="var(--text-primary)"
              mb={2}
            >
              {selectedRecording.title || 'Untitled Recording'}
            </Text>
          </Box>
          <Flex gap={2} ml={4} wrap="wrap">
            <IconButton
              aria-label="Inbox"
              icon={<FaInbox />}
              onClick={onToggleInbox}
              color={selectedRecording.is_inbox ? 'blue.500' : undefined}
            />
            <IconButton
              aria-label="Star"
              icon={<FaStar />}
              onClick={onToggleHighlight}
              color={
                selectedRecording.is_highlighted ? 'yellow.500' : undefined
              }
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
              color="orange.500"
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
              color="red.500"
            />
          </Flex>
        </Flex>
        {/* Metadata Row */}
        <Flex
          flexWrap="wrap"
          align="center"
          gap={6}
          fontSize="sm"
          color="var(--text-muted)"
          mt={2}
        >
          <Flex align="center" gap={2}>
            <FaUsers color="var(--text-accent)" />
            {selectedRecording.participants || 'No participants'}
          </Flex>
          <Flex align="center" gap={2}>
            <FaCalendar color="var(--text-accent)" />
            {selectedRecording.meeting_date || 'No date set'}
          </Flex>
          {selectedRecording.status !== 'COMPLETED' && (
            <Badge colorScheme="yellow">{selectedRecording.status}</Badge>
          )}
        </Flex>
      </Box>
      {/* Main Content Split View */}
      <Flex flex="1" overflow="hidden">
        {/* Left Panel: Transcript */}
        <Box
          flex="1"
          minW={0}
          display="flex"
          flexDirection="column"
          borderRight="1px"
          borderColor="var(--border-primary)"
        >
          <Box
            bg="var(--bg-tertiary)"
            px={4}
            py={3}
            borderBottom="1px"
            borderColor="var(--border-primary)"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontWeight="semibold" display="flex" alignItems="center">
              <FaFileAlt style={{ marginRight: 8 }} />
              Transcript
            </Text>
            <Flex gap={2}>
              <Button size="sm" leftIcon={<FaCopy />}>
                Copy
              </Button>
              <Button size="sm" leftIcon={<FaEdit />}>
                Edit
              </Button>
            </Flex>
          </Box>
          <Box flex="1" overflowY="auto" p={4}>
            <Text color="gray.400">Transcript content here...</Text>
          </Box>
        </Box>
        {/* Right Panel: Summary/Notes/Chat */}
        <Box flex="1" minW={0} display="flex" flexDirection="column">
          {/* Audio Player */}
          <Box
            bg="var(--bg-secondary)"
            p={4}
            borderBottom="1px"
            borderColor="var(--border-primary)"
          >
            <audio
              controls
              src={selectedRecording.audioUrl || ''}
              style={{ width: '100%' }}
            />
          </Box>
          {/* Tabs */}
          <Tabs variant="soft-rounded" colorScheme="blue" flex="1">
            <TabList
              bg="var(--bg-tertiary)"
              borderBottom="1px"
              borderColor="var(--border-primary)"
            >
              <Tab>Summary</Tab>
              <Tab>Notes</Tab>
              <Tab>Chat</Tab>
            </TabList>
            <TabPanels flex="1" overflowY="auto">
              <TabPanel p={4}>
                {/* Summary Panel */}
                {editingSummary ? (
                  <Box>
                    <Textarea
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                    <Flex justify="end" gap={2} mt={2}>
                      <Button
                        size="sm"
                        onClick={() => setEditingSummary(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => setEditingSummary(false)}
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
                    >
                      Edit
                    </Button>
                    <Box>
                      {summary || (
                        <Text color="gray.400">No summary available</Text>
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
                    />
                    <Flex justify="end" gap={2} mt={2}>
                      <Button size="sm" onClick={() => setEditingNotes(false)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => setEditingNotes(false)}
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
                    >
                      Edit
                    </Button>
                    <Box>
                      {notes || (
                        <Text color="gray.400">No notes available</Text>
                      )}
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
                      color="gray.400"
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
                    />
                    <Button
                      leftIcon={<FaPaperPlane />}
                      colorScheme="blue"
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
    </Flex>
  );
};

export default RecordingDetailView;

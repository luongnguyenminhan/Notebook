import React, { useRef, useState, useMemo } from 'react';
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
  useColorMode,
  useColorModeValue,
  useToast,
  Divider,
} from '@chakra-ui/react';
import {
  FaMicrophone,
  FaMoon,
  FaSun,
  FaFileAlt,
  FaStickyNote,
  FaCopy,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaComments,
} from 'react-icons/fa';

function parseTranscription(transcription) {
  if (!transcription)
    return {
      hasDialogue: false,
      content: '',
      speakers: [],
      simpleSegments: [],
      bubbleRows: [],
    };
  let transcriptionData;
  try {
    transcriptionData = JSON.parse(transcription);
  } catch {
    transcriptionData = null;
  }
  if (transcriptionData && Array.isArray(transcriptionData)) {
    const wasDiarized = transcriptionData.some((segment) => segment.speaker);
    if (!wasDiarized) {
      const segments = transcriptionData.map((segment) => ({
        sentence: segment.sentence,
        startTime: segment.start_time,
      }));
      return {
        hasDialogue: false,
        isJson: true,
        content: segments.map((s) => s.sentence).join('\n'),
        simpleSegments: segments,
        speakers: [],
        bubbleRows: [],
      };
    }
    const speakers = [
      ...new Set(
        transcriptionData.map((segment) => segment.speaker).filter(Boolean),
      ),
    ];
    const speakerColors = {};
    speakers.forEach((speaker, index) => {
      speakerColors[speaker] = `speaker-color-${(index % 8) + 1}`;
    });
    const simpleSegments = transcriptionData.map((segment) => ({
      speakerId: segment.speaker,
      speaker: segment.speaker,
      sentence: segment.sentence,
      startTime: segment.start_time || segment.startTime,
      endTime: segment.end_time || segment.endTime,
      color: speakerColors[segment.speaker] || 'speaker-color-1',
    }));
    const processedSimpleSegments = [];
    let lastSpeaker = null;
    simpleSegments.forEach((segment) => {
      processedSimpleSegments.push({
        ...segment,
        showSpeaker: segment.speaker !== lastSpeaker,
      });
      lastSpeaker = segment.speaker;
    });
    const bubbleRows = [];
    let lastBubbleSpeaker = null;
    simpleSegments.forEach((segment) => {
      if (bubbleRows.length === 0 || segment.speaker !== lastBubbleSpeaker) {
        bubbleRows.push({
          speaker: segment.speaker,
          color: segment.color,
          isMe:
            segment.speaker &&
            typeof segment.speaker === 'string' &&
            segment.speaker.toLowerCase().includes('me'),
          bubbles: [],
        });
        lastBubbleSpeaker = segment.speaker;
      }
      bubbleRows[bubbleRows.length - 1].bubbles.push({
        sentence: segment.sentence,
        startTime: segment.startTime || segment.start_time,
        color: segment.color,
      });
    });
    return {
      hasDialogue: true,
      isJson: true,
      segments: simpleSegments,
      simpleSegments: processedSimpleSegments,
      bubbleRows: bubbleRows,
      speakers: speakers.map((speaker) => ({
        name: speaker,
        color: speakerColors[speaker],
      })),
    };
  }
  return {
    hasDialogue: false,
    content: transcription,
    speakers: [],
    simpleSegments: [],
    bubbleRows: [],
  };
}

const SharedRecordingView = ({ recording }) => {
  const [activeTab, setActiveTab] = useState('transcription');
  const [transcriptView, setTranscriptView] = useState('simple');
  const [legendExpanded, setLegendExpanded] = useState(false);
  const audioPlayer = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const processedTranscription = useMemo(
    () => parseTranscription(recording.transcription),
    [recording.transcription],
  );

  const handleSeekAudio = (startTime) => {
    if (startTime && audioPlayer.current) {
      audioPlayer.current.currentTime = parseFloat(startTime);
      audioPlayer.current.play();
    }
  };
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    });
  };

  return (
    <Flex
      direction="column"
      h="100vh"
      bg="var(--bg-primary)"
      color="var(--text-primary)"
    >
      {/* Header */}
      <Flex
        as="header"
        bg="var(--bg-secondary)"
        borderBottom="1px"
        borderColor="var(--border-primary)"
        px={4}
        py={3}
        align="center"
        justify="space-between"
        flexShrink={0}
        zIndex={50}
      >
        <Flex align="center" gap={3}>
          <Box as="img" src="/favicon.svg" alt="Speakr" w={8} h={8} />
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              {recording.title}
            </Text>
            <Text fontSize="sm" color="var(--text-muted)">
              Shared Recording
            </Text>
          </Box>
        </Flex>
        <IconButton
          aria-label="toggle theme"
          icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}
          onClick={toggleColorMode}
          rounded="lg"
          _hover={{ bg: 'var(--bg-tertiary)' }}
        />
      </Flex>
      {/* Audio Player */}
      <Box
        bg="var(--bg-secondary)"
        p={4}
        borderBottom="1px"
        borderColor="var(--border-primary)"
        flexShrink={0}
      >
        <Box maxW="4xl" mx="auto">
          <audio
            controls
            ref={audioPlayer}
            src={recording.audioUrl || `/share/audio/${recording.public_id}`}
            style={{ width: '100%' }}
          />
        </Box>
      </Box>
      {/* Tabs */}
      <Box
        bg="var(--bg-tertiary)"
        borderBottom="1px"
        borderColor="var(--border-primary)"
        flexShrink={0}
      >
        <Box maxW="4xl" mx="auto">
          <Flex>
            <Button
              flex={1}
              variant="ghost"
              fontWeight="medium"
              fontSize="sm"
              borderBottomWidth={activeTab === 'transcription' ? 2 : 0}
              borderColor="var(--border-focus)"
              color={
                activeTab === 'transcription'
                  ? 'var(--text-accent)'
                  : 'var(--text-muted)'
              }
              onClick={() => setActiveTab('transcription')}
              leftIcon={<FaFileText />}
            >
              Transcription
            </Button>
            {recording.summary && (
              <Button
                flex={1}
                variant="ghost"
                fontWeight="medium"
                fontSize="sm"
                borderBottomWidth={activeTab === 'summary' ? 2 : 0}
                borderColor="var(--border-focus)"
                color={
                  activeTab === 'summary'
                    ? 'var(--text-accent)'
                    : 'var(--text-muted)'
                }
                onClick={() => setActiveTab('summary')}
                leftIcon={<FaFileAlt />}
              >
                Summary
              </Button>
            )}
            {recording.notes && (
              <Button
                flex={1}
                variant="ghost"
                fontWeight="medium"
                fontSize="sm"
                borderBottomWidth={activeTab === 'notes' ? 2 : 0}
                borderColor="var(--border-focus)"
                color={
                  activeTab === 'notes'
                    ? 'var(--text-accent)'
                    : 'var(--text-muted)'
                }
                onClick={() => setActiveTab('notes')}
                leftIcon={<FaStickyNote />}
              >
                Notes
              </Button>
            )}
          </Flex>
        </Box>
      </Box>
      {/* Tab Content */}
      <Flex flex="1" direction="column" overflow="hidden">
        <Box
          maxW="4xl"
          mx="auto"
          p={4}
          flex="1"
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          {/* Transcription */}
          {activeTab === 'transcription' && (
            <Flex direction="column" flex="1" overflow="hidden">
              <Flex
                align="center"
                justify="space-between"
                mb={4}
                flexShrink={0}
              >
                {processedTranscription.hasDialogue && (
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant={
                        transcriptView === 'simple' ? 'solid' : 'outline'
                      }
                      leftIcon={<FaFileText />}
                      onClick={() => setTranscriptView('simple')}
                    >
                      Simple
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        transcriptView === 'bubble' ? 'solid' : 'outline'
                      }
                      leftIcon={<FaComments />}
                      onClick={() => setTranscriptView('bubble')}
                    >
                      Bubble
                    </Button>
                  </Flex>
                )}
                <Button
                  size="sm"
                  leftIcon={<FaCopy />}
                  onClick={() =>
                    handleCopy(
                      processedTranscription.isJson
                        ? processedTranscription.segments
                            .map((s) => `[${s.speaker}]: ${s.sentence}`)
                            .join('\n')
                        : recording.transcription,
                    )
                  }
                >
                  Copy
                </Button>
              </Flex>
              {/* Speaker Legend */}
              {processedTranscription.hasDialogue &&
                processedTranscription.speakers.length > 0 &&
                transcriptView === 'bubble' && (
                  <Box className="speaker-legend" mb={4} flexShrink={0}>
                    <Flex
                      align="center"
                      justify="space-between"
                      onClick={() => setLegendExpanded((v) => !v)}
                      cursor="pointer"
                    >
                      <Flex align="center" gap={2}>
                        <FaUsers />
                        Speakers{' '}
                        <Text fontSize="sm">
                          ({processedTranscription.speakers.length})
                        </Text>
                      </Flex>
                      <Box as={legendExpanded ? FaChevronUp : FaChevronDown} />
                    </Flex>
                    {legendExpanded && (
                      <Flex gap={2} mt={2} wrap="wrap">
                        {processedTranscription.speakers.map((speaker, idx) => (
                          <Box
                            key={idx}
                            className={speaker.color}
                            px={2}
                            py={1}
                            borderRadius="md"
                            fontSize="sm"
                          >
                            {speaker.name}
                          </Box>
                        ))}
                      </Flex>
                    )}
                  </Box>
                )}
              {/* Transcription Content */}
              <Box
                flex="1"
                overflowY="auto"
                onClick={(e) => {
                  const startTime = e.target.dataset.startTime;
                  if (startTime) handleSeekAudio(startTime);
                }}
              >
                {/* Simple View */}
                {transcriptView === 'simple' && (
                  <Box>
                    {processedTranscription.simpleSegments.map(
                      (segment, idx) => (
                        <Flex
                          key={idx}
                          align="start"
                          gap={2}
                          mb={2}
                          className="speaker-segment"
                          data-start-time={segment.startTime}
                          cursor="pointer"
                          _hover={{ bg: 'var(--bg-accent-hover)' }}
                          p={2}
                          borderRadius="md"
                        >
                          {segment.showSpeaker && (
                            <Box
                              className={segment.color}
                              fontWeight="bold"
                              minW={20}
                            >
                              {segment.speaker}
                            </Box>
                          )}
                          <Box>{segment.sentence}</Box>
                        </Flex>
                      ),
                    )}
                  </Box>
                )}
                {/* Bubble View */}
                {transcriptView === 'bubble' && (
                  <Box>
                    {processedTranscription.bubbleRows.map((row, rowIdx) => (
                      <Flex
                        key={rowIdx}
                        gap={2}
                        mb={2}
                        align="start"
                        className={row.isMe ? 'speaker-me' : ''}
                      >
                        {row.bubbles.map((bubble, idx) => (
                          <Box
                            key={idx}
                            className={`speaker-bubble ${bubble.color} ${row.isMe ? 'speaker-me' : ''}`}
                            data-start-time={bubble.startTime}
                            cursor="pointer"
                            borderRadius="md"
                            p={2}
                          >
                            {bubble.sentence}
                          </Box>
                        ))}
                      </Flex>
                    ))}
                  </Box>
                )}
                {/* Plain Text View */}
                {!processedTranscription.isJson && (
                  <Box
                    whiteSpace="pre-wrap"
                    cursor="pointer"
                    _hover={{ bg: 'var(--bg-accent-hover)' }}
                    p={2}
                    borderRadius="md"
                  >
                    {processedTranscription.content}
                  </Box>
                )}
              </Box>
            </Flex>
          )}
          {/* Summary */}
          {activeTab === 'summary' && (
            <Flex direction="column" flex="1" overflow="hidden">
              <Flex align="end" justify="end" mb={4} flexShrink={0}>
                <Button
                  size="sm"
                  leftIcon={<FaCopy />}
                  onClick={() => handleCopy(recording.summary)}
                >
                  Copy
                </Button>
              </Flex>
              <Box flex="1" overflowY="auto" className="summary-box">
                {recording.summary}
              </Box>
            </Flex>
          )}
          {/* Notes */}
          {activeTab === 'notes' && (
            <Flex direction="column" flex="1" overflow="hidden">
              <Flex align="end" justify="end" mb={4} flexShrink={0}>
                <Button
                  size="sm"
                  leftIcon={<FaCopy />}
                  onClick={() => handleCopy(recording.notes)}
                >
                  Copy
                </Button>
              </Flex>
              <Box flex="1" overflowY="auto" className="notes-box">
                {recording.notes}
              </Box>
            </Flex>
          )}
        </Box>
      </Flex>
      {/* Footer */}
      <Box
        as="footer"
        bg="var(--bg-secondary)"
        borderTop="1px"
        borderColor="var(--border-primary)"
        py={4}
        px={4}
        flexShrink={0}
      >
        <Flex
          maxW="4xl"
          mx="auto"
          direction={{ base: 'column', sm: 'row' }}
          align="center"
          justify="space-between"
          gap={3}
          fontSize="sm"
          color="var(--text-muted)"
        >
          <Flex align="center" gap={2}>
            <span>&copy; 2025 Speakr</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs">
              Powered by advanced AI transcription
            </span>
          </Flex>
          <Flex align="center" gap={2}>
            <span className="text-xs">Built with</span>
            <a
              href="https://github.com/murtaza-nasir/speakr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--text-accent)] hover:text-[var(--text-primary)] transition-colors font-medium"
            >
              <i className="fab fa-github text-sm"></i>
              <span>Speakr</span>
              <i className="fas fa-external-link-alt text-xs opacity-70"></i>
            </a>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SharedRecordingView;

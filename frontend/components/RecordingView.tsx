import React, { useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Textarea,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaStop, FaUpload, FaTrash, FaPencilAlt, FaMicrophone, FaDesktop } from 'react-icons/fa';

interface RecordingViewProps {
  isRecording: boolean;
  recordingMode: 'microphone' | 'system' | 'both';
  audioBlobURL?: string;
  recordingTime: string;
  onStop: () => void;
  onUpload: () => void;
  onDiscard: () => void;
  recordingNotes: string;
  setRecordingNotes: (v: string) => void;
}

const RecordingView: React.FC<RecordingViewProps> = ({
  isRecording,
  recordingMode,
  audioBlobURL,
  recordingTime,
  onStop,
  onUpload,
  onDiscard,
  recordingNotes,
  setRecordingNotes,
}) => {
  const micRef = useRef<HTMLCanvasElement>(null);
  const sysRef = useRef<HTMLCanvasElement>(null);
  const visRef = useRef<HTMLCanvasElement>(null);
  // (Có thể thêm logic vẽ visualizer sau)

  return (
    <Flex flex="1" direction="column" p={{ base: 4, md: 8 }} bg="var(--bg-primary)" minH={0} overflowY="auto">
      <Flex flex="1" direction="column" maxW="4xl" w="full" mx="auto" bg="var(--bg-secondary)" borderRadius="xl" borderWidth={1} borderColor="var(--border-primary)" minH={0}>
        {/* Top: Visualizer & Status */}
        <Box flexShrink={0} p={{ base: 4, md: 6 }} textAlign="center" bg="var(--bg-tertiary)" borderBottom="1px" borderColor="var(--border-primary)">
          {isRecording && (
            <Box w="full" mx="auto" mb={4}>
              {recordingMode === 'both' ? (
                <Flex maxW="4xl" mx="auto" gap={4}>
                  <Box w="50%" h={{ base: 32, md: 40 }} bg="var(--bg-primary)" borderRadius="lg" p={2} display="flex" flexDirection="column">
                    <Box flex="1" w="full" overflow="hidden" borderRadius="md">
                      <canvas ref={micRef} width={400} height={80} style={{ width: '100%', height: '100%' }} />
                    </Box>
                    <Text fontSize="xs" color="var(--text-muted)" pt={1}>Microphone</Text>
                  </Box>
                  <Box w="50%" h={{ base: 32, md: 40 }} bg="var(--bg-primary)" borderRadius="lg" p={2} display="flex" flexDirection="column">
                    <Box flex="1" w="full" overflow="hidden" borderRadius="md">
                      <canvas ref={sysRef} width={400} height={80} style={{ width: '100%', height: '100%' }} />
                    </Box>
                    <Text fontSize="xs" color="var(--text-muted)" pt={1}>System Audio</Text>
                  </Box>
                </Flex>
              ) : (
                <Box h={{ base: 32, md: 40 }} maxW="2xl" mx="auto" bg="var(--bg-primary)" borderRadius="lg" p={2} display="flex" flexDirection="column">
                  <Box flex="1" w="full" overflow="hidden" borderRadius="md">
                    <canvas ref={visRef} width={400} height={80} style={{ width: '100%', height: '100%' }} />
                  </Box>
                  <Text fontSize="xs" color="var(--text-muted)" pt={1} textTransform="capitalize">{recordingMode}</Text>
                </Box>
              )}
            </Box>
          )}
          {!isRecording && audioBlobURL && (
            <Box h={{ base: 24, md: 32 }} w="full" display="flex" alignItems="center" justifyContent="center" mb={4}>
              <audio src={audioBlobURL} controls style={{ width: '100%', maxWidth: 400 }} />
            </Box>
          )}
          <Box>
            <Text fontSize="2xl" fontFamily="mono" color="var(--text-accent)">{recordingTime}</Text>
            <Text fontSize="sm" color="var(--text-muted)">{isRecording ? 'Recording in progress...' : 'Recording finished'}</Text>
          </Box>
        </Box>
        {/* Middle: Notepad */}
        <Flex flex="1" p={{ base: 4, md: 6 }} minH={0} overflow="hidden" direction="column">
          <Text as="label" htmlFor="recordingNotes" fontSize="sm" fontWeight="medium" color="var(--text-secondary)" mb={2} display="flex" alignItems="center" gap={1} flexShrink={0}>
            <Box as={FaPencilAlt} mr={1} /> Recording Notes (Markdown)
          </Text>
          <Box flex="1" minH={0}>
            <Textarea
              id="recordingNotes"
              value={recordingNotes}
              onChange={e => setRecordingNotes(e.target.value)}
              bg="var(--bg-input)"
              borderColor="var(--border-secondary)"
              borderRadius="lg"
              p={3}
              fontSize="sm"
              resize="none"
              minH={32}
              h="100%"
              focusBorderColor="var(--ring-focus)"
              placeholder="Type your notes in Markdown format..."
            />
          </Box>
        </Flex>
        {/* Bottom: Action Buttons */}
        <Box flexShrink={0} p={{ base: 4, md: 6 }} bg="var(--bg-tertiary)" borderTop="1px" borderColor="var(--border-primary)">
          {isRecording ? (
            <Flex justify="center">
              <Button leftIcon={<FaStop />} colorScheme="red" size="lg" px={8} py={3} onClick={onStop} _hover={{ bg: 'red.700' }} className="animate-pulse">Stop Recording</Button>
            </Flex>
          ) : audioBlobURL ? (
            <Flex direction={{ base: 'column', sm: 'row' }} gap={3} justify="center">
              <Button leftIcon={<FaUpload />} colorScheme="blue" flex={1} px={6} py={3} onClick={onUpload}>{'Upload Recording & Notes'}</Button>
              <Button leftIcon={<FaTrash />} colorScheme="red" px={6} py={3} onClick={onDiscard}>{'Discard'}</Button>
            </Flex>
          ) : null}
        </Box>
      </Flex>
    </Flex>
  );
};

export default RecordingView; 
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  Input,
} from '@chakra-ui/react';
import {
  FaSyncAlt,
  FaExclamationTriangle,
  FaClock,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';

interface ReprocessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReprocess: () => void;
  reprocessType: 'transcription' | 'summary';
  reprocessRecording?: any;
  useAsrEndpoint?: boolean;
  asrReprocessOptions?: any;
  setAsrReprocessOptions?: (opts: any) => void;
  processingMessage?: string;
  loading?: boolean;
}

const ReprocessModal: React.FC<ReprocessModalProps> = ({
  isOpen,
  onClose,
  onReprocess,
  reprocessType,
  reprocessRecording,
  useAsrEndpoint,
  asrReprocessOptions = {},
  setAsrReprocessOptions,
  processingMessage,
  loading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
    <ModalOverlay />
    <ModalContent borderRadius="xl">
      <ModalHeader
        bgGradient="linear(to-r, var(--bg-accent), var(--bg-secondary))"
        borderTopRadius="xl"
      >
        <Flex align="center" gap={3}>
          <Box
            w={12}
            h={12}
            bgGradient="linear(to-br, blue.500, purple.600)"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="lg"
          >
            <FaSyncAlt color="white" fontSize="lg" />
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold">
              Confirm Reprocessing
            </Text>
            <Text
              fontSize="sm"
              color="var(--text-muted)"
              textTransform="capitalize"
            >
              {reprocessType} reprocessing
            </Text>
          </Box>
        </Flex>
      </ModalHeader>
      <ModalBody>
        {reprocessRecording && (
          <Box
            mb={6}
            bg="var(--bg-tertiary)"
            borderRadius="lg"
            p={4}
            borderWidth={1}
            borderColor="var(--border-primary)"
          >
            <Flex align="start" gap={3}>
              <FaSyncAlt color="var(--text-accent)" style={{ marginTop: 4 }} />
              <Box flex={1} minW={0}>
                <Text
                  fontWeight="medium"
                  isTruncated
                  title={reprocessRecording.title}
                >
                  {reprocessRecording.title || 'Untitled Recording'}
                </Text>
                <Text fontSize="sm" color="var(--text-muted)" mt={1}>
                  Created:{' '}
                  {reprocessRecording.created_at
                    ? new Date(
                        reprocessRecording.created_at,
                      ).toLocaleDateString()
                    : ''}
                </Text>
              </Box>
            </Flex>
          </Box>
        )}
        <Box mb={4}>
          <Flex align="start" gap={3}>
            <Box
              w={6}
              h={6}
              bg="amber.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={0.5}
            >
              <FaExclamationTriangle color="#f59e42" fontSize="xs" />
            </Box>
            <Box>
              <Text fontWeight="medium">What will happen?</Text>
              <Text fontSize="sm" color="var(--text-muted)">
                {reprocessType === 'transcription' &&
                  !useAsrEndpoint &&
                  'The audio will be re-transcribed from scratch. This will also regenerate the title and summary based on the new transcription.'}
                {reprocessType === 'transcription' &&
                  useAsrEndpoint &&
                  'The audio will be re-transcribed using the ASR endpoint. This includes diarization and will regenerate the title and summary.'}
                {reprocessType === 'summary' &&
                  'A new title and summary will be generated based on the existing transcription.'}
              </Text>
            </Box>
          </Flex>
        </Box>
        {reprocessType === 'transcription' &&
          useAsrEndpoint &&
          setAsrReprocessOptions && (
            <Box
              pt={4}
              borderTopWidth={1}
              borderColor="var(--border-primary)"
              mb={4}
            >
              <Text fontWeight="semibold" mb={2}>
                ASR Options
              </Text>
              <Input
                placeholder="Language (e.g., en, es, zh)"
                value={asrReprocessOptions.language || ''}
                onChange={(e) =>
                  setAsrReprocessOptions({
                    ...asrReprocessOptions,
                    language: e.target.value,
                  })
                }
                mb={2}
              />
              <Input
                placeholder="Min Speakers"
                type="number"
                value={asrReprocessOptions.min_speakers || ''}
                onChange={(e) =>
                  setAsrReprocessOptions({
                    ...asrReprocessOptions,
                    min_speakers: e.target.value,
                  })
                }
                mb={2}
              />
              <Input
                placeholder="Max Speakers"
                type="number"
                value={asrReprocessOptions.max_speakers || ''}
                onChange={(e) =>
                  setAsrReprocessOptions({
                    ...asrReprocessOptions,
                    max_speakers: e.target.value,
                  })
                }
              />
            </Box>
          )}
        <Box mb={4}>
          <Flex align="start" gap={3}>
            <Box
              w={6}
              h={6}
              bg="blue.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={0.5}
            >
              <FaClock color="#4299e1" fontSize="xs" />
            </Box>
            <Box>
              <Text fontWeight="medium">Processing time</Text>
              <Text fontSize="sm" color="var(--text-muted)">
                This may take a few minutes to complete. You can continue using
                the app while processing.
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box mb={4}>
          <Flex align="start" gap={3}>
            <Box
              w={6}
              h={6}
              bg="red.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={0.5}
            >
              <FaInfoCircle color="#ef4444" fontSize="xs" />
            </Box>
            <Box>
              <Text fontWeight="medium">Important note</Text>
              <Text fontSize="sm" color="var(--text-muted)">
                {reprocessType === 'transcription' &&
                  'Any manual edits to the transcription, title, or summary will be overwritten.'}
                {reprocessType === 'summary' &&
                  'Any manual edits to the title or summary will be overwritten.'}
              </Text>
            </Box>
          </Flex>
        </Box>
      </ModalBody>
      <ModalFooter bg="var(--bg-tertiary)" borderBottomRadius="xl">
        <Button
          onClick={onClose}
          variant="ghost"
          color="var(--text-secondary)"
          leftIcon={<FaTimes />}
          mr={3}
        >
          Cancel
        </Button>
        <Button
          onClick={onReprocess}
          colorScheme="blue"
          leftIcon={<FaSyncAlt />}
          isLoading={loading}
        >
          Start Reprocessing
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ReprocessModal;

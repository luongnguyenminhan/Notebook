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
  Checkbox,
  Spinner,
} from '@chakra-ui/react';
import { FaShareAlt, FaCopy } from 'react-icons/fa';

interface ShareRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  onCopy: () => void;
  shareOptions: { share_summary: boolean; share_notes: boolean };
  setShareOptions: (opts: any) => void;
  generatedShareLink?: string;
  loading?: boolean;
  recordingTitle?: string;
}

const ShareRecordingModal: React.FC<ShareRecordingModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onCopy,
  shareOptions,
  setShareOptions,
  generatedShareLink,
  loading,
  recordingTitle,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
    <ModalOverlay />
    <ModalContent borderRadius="lg">
      <ModalHeader borderBottomWidth={1} borderColor="var(--border-primary)">
        <FaShareAlt style={{ marginRight: 8 }} /> Share Recording
      </ModalHeader>
      <ModalBody p={6}>
        <Text fontSize="sm" color="var(--text-muted)" mb={4}>
          Create a public link to share this recording. Sharing is only
          available on secure (HTTPS) connections.
        </Text>
        {!generatedShareLink ? (
          <Box>
            <Flex align="center" mb={2}>
              <Checkbox
                isChecked={shareOptions.share_summary}
                onChange={(e) =>
                  setShareOptions({
                    ...shareOptions,
                    share_summary: e.target.checked,
                  })
                }
                id="share_summary"
                mr={2}
                colorScheme="blue"
              >
                Share Summary
              </Checkbox>
            </Flex>
            <Flex align="center">
              <Checkbox
                isChecked={shareOptions.share_notes}
                onChange={(e) =>
                  setShareOptions({
                    ...shareOptions,
                    share_notes: e.target.checked,
                  })
                }
                id="share_notes"
                mr={2}
                colorScheme="blue"
              >
                Share Notes
              </Checkbox>
            </Flex>
          </Box>
        ) : (
          <Box mt={4}>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Shareable Link
            </Text>
            <Flex align="center" gap={2}>
              <Input
                value={generatedShareLink}
                readOnly
                bg="var(--bg-input)"
                borderColor="var(--border-secondary)"
              />
              <Button onClick={onCopy} leftIcon={<FaCopy />} colorScheme="blue">
                Copy
              </Button>
            </Flex>
          </Box>
        )}
        {loading && <Spinner size="sm" mt={4} />}
      </ModalBody>
      <ModalFooter borderTopWidth={1} borderColor="var(--border-primary)">
        <Button
          onClick={onClose}
          variant="ghost"
          color="var(--text-secondary)"
          mr={3}
        >
          Cancel
        </Button>
        {!generatedShareLink && (
          <Button onClick={onCreate} colorScheme="blue" isLoading={loading}>
            Create Link
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ShareRecordingModal;

import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Box, Text, Flex } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDeleteRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  recordingTitle?: string;
}

const ConfirmDeleteRecordingModal: React.FC<ConfirmDeleteRecordingModalProps> = ({ isOpen, onClose, onDelete, recordingTitle }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent bg="var(--bg-secondary)">
      <ModalBody p={6}>
        <Flex align="center" gap={4} mb={4}>
          <Box as={FaExclamationTriangle} fontSize="3xl" color="var(--text-danger)" />
          <Box>
            <Text fontSize="lg" fontWeight="semibold">Delete Recording</Text>
            <Text color="var(--text-muted)">This action cannot be undone.</Text>
          </Box>
        </Flex>
        <Text color="var(--text-secondary)" mb={6}>
          Are you sure you want to delete "{recordingTitle || 'this recording'}"?
        </Text>
        <Flex justify="end" gap={3}>
          <Button onClick={onClose} variant="ghost" color="var(--text-secondary)" _hover={{ bg: 'var(--bg-tertiary)' }}>Cancel</Button>
          <Button onClick={onDelete} bg="var(--bg-danger)" color="white" _hover={{ bg: 'var(--bg-danger-hover)' }}>Delete</Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default ConfirmDeleteRecordingModal; 
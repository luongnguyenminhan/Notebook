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
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ResetStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

const ResetStatusModal: React.FC<ResetStatusModalProps> = ({
  isOpen,
  onClose,
  onReset,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent borderRadius="xl">
      <ModalBody p={6} textAlign="center">
        <Flex
          align="center"
          justify="center"
          w={12}
          h={12}
          borderRadius="full"
          bg="orange.100"
          mb={4}
          mx="auto"
        >
          <FaExclamationTriangle color="#f59e42" fontSize="2xl" />
        </Flex>
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color="var(--text-primary)"
          mb={2}
        >
          Reset Recording Status?
        </Text>
        <Text fontSize="sm" color="var(--text-muted)" mb={6}>
          This will mark the recording as 'Failed'. This is useful if processing
          is stuck. You will be able to reprocess it afterwards.
        </Text>
        <Flex justify="end" gap={3}>
          <Button
            onClick={onClose}
            variant="ghost"
            color="var(--text-secondary)"
          >
            Cancel
          </Button>
          <Button
            onClick={onReset}
            bg="orange.500"
            color="white"
            _hover={{ bg: 'orange.600' }}
          >
            Yes, Reset Status
          </Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default ResetStatusModal;

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  t,
}: any) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        {t('confirmDelete', { defaultValue: 'Xác nhận xóa user' })}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {t('confirmDeleteMsg', {
          defaultValue: 'Bạn có chắc chắn muốn xóa user này?',
        })}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={3} variant="ghost">
          {t('cancel', { defaultValue: 'Hủy' })}
        </Button>
        <Button colorScheme="red" onClick={onConfirm} isLoading={isLoading}>
          {t('delete', { defaultValue: 'Xóa' })}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ConfirmDeleteModal;

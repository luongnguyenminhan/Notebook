import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

const UploadModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const t = useTranslations('UploadModal');
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('uploadTitle', { defaultValue: 'Tải lên bản ghi mới' })}
        </ModalHeader>
        <ModalBody>
          <Input type="file" accept="audio/*" />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>
            {t('close', { defaultValue: 'Đóng' })}
          </Button>
          <Button colorScheme="blue" ml={3}>
            {t('upload', { defaultValue: 'Tải lên' })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default UploadModal;

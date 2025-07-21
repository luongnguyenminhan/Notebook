import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { uploadRecordingFile } from '@/services/api/recording';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploaded,
}) => {
  const t = useTranslations('UploadModal');
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      // Only upload the first file for demo
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      // You may need to add more fields depending on backend
      await uploadRecordingFile(formData);
      toast({
        title: t('success', { defaultValue: 'Tải lên thành công!' }),
        status: 'success',
      });
      onClose();
      if (onUploaded) onUploaded();
    } catch (err) {
      console.log(err);
      toast({
        title: t('error', { defaultValue: 'Tải lên thất bại!' }),
        status: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('uploadTitle', { defaultValue: 'Tải lên bản ghi mới' })}
        </ModalHeader>
        <ModalBody>
          <Input ref={fileInputRef} type="file" accept="audio/*" />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} isDisabled={uploading}>
            {t('close', { defaultValue: 'Đóng' })}
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={handleUpload}
            isLoading={uploading}
          >
            {t('upload', { defaultValue: 'Tải lên' })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default UploadModal;

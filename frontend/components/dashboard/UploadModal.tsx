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
      <ModalContent
        style={{
          borderRadius: '1.5rem',
          background: '#fff',
          color: 'var(--text-color-light)',
          boxShadow: '0 8px 32px 0 var(--shadow-color)',
        }}
        _dark={{
          background: '#fff',
          color: 'var(--text-color-dark)',
        }}
      >
        <ModalHeader
          style={{
            fontWeight: 700,
            color: 'var(--primary-color)',
            borderRadius: '1.5rem 1.5rem 0 0',
            textAlign: 'center',
          }}
        >
          {t('uploadTitle', { defaultValue: 'Tải lên bản ghi mới' })}
        </ModalHeader>
        <ModalBody>
          <Input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            borderRadius="xl"
            boxShadow="sm"
            bg="var(--input-bg-light)"
            color="var(--text-color-light)"
            _dark={{
              bg: 'var(--input-bg-dark)',
              color: 'var(--text-color-dark)',
            }}
            border="none"
            p={3}
            _focus={{
              boxShadow: '0 0 0 3px var(--primary-color)',
              transform: 'scale(1.03)',
            }}
            transition="all 0.2s"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            isDisabled={uploading}
            borderRadius="xl"
            bg="var(--input-bg-light)"
            color="var(--text-color-light)"
            _dark={{
              bg: 'var(--input-bg-dark)',
              color: 'var(--text-color-dark)',
            }}
            boxShadow="sm"
            border="none"
            _hover={{ filter: 'brightness(1.05)', transform: 'scale(1.02)' }}
            transition="all 0.2s"
          >
            {t('close', { defaultValue: 'Đóng' })}
          </Button>
          <Button
            ml={3}
            onClick={handleUpload}
            isLoading={uploading}
            borderRadius="xl"
            style={{
              background: '#0070f3',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px 0 rgba(0,112,243,0.10)',
            }}
            _hover={{
              filter: 'brightness(1.1)',
              transform: 'scale(1.04)',
              background: 'var(--primary-color)',
            }}
            _active={{
              filter: 'brightness(0.95)',
              background: 'var(--primary-color)',
            }}
            transition="all 0.2s"
          >
            {t('upload', { defaultValue: 'Tải lên' })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default UploadModal;

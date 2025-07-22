import { showToast } from '@/hooks/useShowToast';
import { uploadRecordingFile } from '@/services/api/recording';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Màu Chakra UI
  const modalBg = useColorModeValue('white', 'gray.800');
  const modalColor = useColorModeValue('gray.900', 'gray.100');
  const headerColor = useColorModeValue('blue.600', 'blue.300');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const inputColor = useColorModeValue('gray.900', 'gray.100');
  const closeBtnBg = useColorModeValue('gray.100', 'gray.700');
  const closeBtnColor = useColorModeValue('gray.800', 'gray.100');
  const uploadBtnBg = useColorModeValue('#0070f3', 'blue.400');
  const uploadBtnHover = useColorModeValue('#339dff', 'blue.500');
  const uploadBtnActive = useColorModeValue('#0070f3', 'blue.600');

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
      showToast(
        'success',
        t('success', { defaultValue: 'Tải lên thành công!' }),
      );
      // toast({
      //   title: t('success', { defaultValue: 'Tải lên thành công!' }),
      //   status: 'success',
      // });
      onClose();
      if (onUploaded) onUploaded();
    } catch (err) {
      console.log(err);
      showToast('error', t('error', { defaultValue: 'Tải lên thất bại!' }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="1.5rem"
        bg={modalBg}
        color={modalColor}
        boxShadow="0 8px 32px 0 rgba(0,0,0,0.12)"
        height={300}
      >
        <ModalHeader
          fontWeight={700}
          color={headerColor}
          borderRadius="1.5rem 1.5rem 0 0"
          textAlign="center"
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
            bg={inputBg}
            color={inputColor}
            border="none"
            p={3}
            _focus={{
              boxShadow: '0 0 0 3px var(--primary-color)',
              transform: 'scale(1.03)',
              bg: inputBg,
            }}
            transition="all 0.2s"
            height={100}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onClose}
            isDisabled={uploading}
            borderRadius="xl"
            bg={closeBtnBg}
            color={closeBtnColor}
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
            bg={uploadBtnBg}
            color="white"
            fontWeight={600}
            boxShadow="0 2px 8px 0 rgba(0,112,243,0.10)"
            _hover={{ bg: uploadBtnHover, filter: 'brightness(1.08)' }}
            _active={{ bg: uploadBtnActive }}
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

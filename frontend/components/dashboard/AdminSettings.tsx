/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Flex,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';

// Mock API (bạn cần thay bằng API thật nếu có)
const fetchSettings = async () => {
  // TODO: thay bằng API thật
  return Promise.resolve([
    {
      id: 1,
      key: 'max_file_size_mb',
      value: '100',
      description: 'Max file size (MB)',
      setting_type: 'number',
      updated_at: '2025-07-21T16:26:56',
    },
    {
      id: 2,
      key: 'transcript_length_limit',
      value: '-1',
      description: 'Transcript length limit',
      setting_type: 'number',
      updated_at: '2025-07-21T16:26:56',
    },
    {
      id: 3,
      key: 'enable_feature_x',
      value: 'true',
      description: 'Enable feature X',
      setting_type: 'boolean',
      updated_at: '2025-07-21T16:26:56',
    },
  ]);
};
const updateSetting = async (id: number, value: string) => {
  // TODO: thay bằng API thật
  return Promise.resolve({ success: true });
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const t = useTranslations('AdminSettings');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchAll = () => {
    setLoading(true);
    fetchSettings()
      .then((data) => {
        setSettings(data);
        setError(null);
      })
      .catch(() =>
        setError(t('fetchError', { defaultValue: 'Lỗi tải settings' })),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEdit = (setting: any) => {
    setEditing(setting);
    setEditValue(setting.value);
    onOpen();
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateSetting(editing.id, editValue);
      toast({
        title: t('updateSuccess', { defaultValue: 'Cập nhật thành công' }),
        status: 'success',
      });
      setEditing(null);
      onClose();
      fetchAll();
    } catch (e: any) {
      toast({
        title: t('updateFail', { defaultValue: 'Cập nhật thất bại' }),
        status: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Flex justify="center" align="center" minH="300px">
        <Spinner size="lg" />
      </Flex>
    );
  if (error)
    return (
      <Box color="red.500" textAlign="center" py={8}>
        {error}
      </Box>
    );
  if (!settings.length)
    return (
      <Box textAlign="center" py={8}>
        {t('noSettings', { defaultValue: 'Không có settings nào' })}
      </Box>
    );

  return (
    <Box>
      <Heading as="h3" size="lg" mb={6}>
        {t('title', { defaultValue: 'System Settings' })}
      </Heading>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>{t('key', { defaultValue: 'Key' })}</Th>
            <Th>{t('value', { defaultValue: 'Value' })}</Th>
            <Th>{t('description', { defaultValue: 'Description' })}</Th>
            <Th>{t('type', { defaultValue: 'Type' })}</Th>
            <Th>{t('updatedAt', { defaultValue: 'Updated At' })}</Th>
            <Th>{t('actions', { defaultValue: 'Actions' })}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {settings.map((setting) => (
            <Tr key={setting.id}>
              <Td>{setting.key}</Td>
              <Td>{setting.value}</Td>
              <Td>{setting.description}</Td>
              <Td>{setting.setting_type}</Td>
              <Td>{formatDate(setting.updated_at)}</Td>
              <Td>
                <IconButton
                  aria-label={t('edit', { defaultValue: 'Edit' })}
                  icon={<EditIcon />}
                  size="sm"
                  onClick={() => handleEdit(setting)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setEditing(null);
          onClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {t('editSetting', { defaultValue: 'Edit Setting' })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>{t('value', { defaultValue: 'Value' })}</FormLabel>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setEditing(null);
                onClose();
              }}
              mr={3}
              variant="ghost"
            >
              {t('cancel', { defaultValue: 'Hủy' })}
            </Button>
            <Button colorScheme="blue" onClick={handleSave} isLoading={saving}>
              {t('save', { defaultValue: 'Lưu' })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export default AdminSettings;

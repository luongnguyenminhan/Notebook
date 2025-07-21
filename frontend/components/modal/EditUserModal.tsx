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
  FormControl,
  FormLabel,
  Input,
  Switch,
} from '@chakra-ui/react';

const EditUserModal = ({
  user,
  setUser,
  isOpen,
  onClose,
  onSave,
  isLoading,
  t,
}: any) => {
  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('editUser', { defaultValue: 'Sửa User' })}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>{t('username', { defaultValue: 'Username' })}</FormLabel>
            <Input
              value={user.username}
              onChange={(e) =>
                setUser((u: any) => ({ ...u, username: e.target.value }))
              }
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>{t('email', { defaultValue: 'Email' })}</FormLabel>
            <Input
              value={user.email}
              onChange={(e) =>
                setUser((u: any) => ({ ...u, email: e.target.value }))
              }
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>
              {t('password', {
                defaultValue: 'Password (để trống nếu không đổi)',
              })}
            </FormLabel>
            <Input
              type="password"
              value={user.password || ''}
              onChange={(e) =>
                setUser((u: any) => ({ ...u, password: e.target.value }))
              }
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>{t('admin', { defaultValue: 'Admin' })}</FormLabel>
            <Switch
              isChecked={user.is_admin}
              onChange={(e) =>
                setUser((u: any) => ({ ...u, is_admin: e.target.checked }))
              }
              colorScheme="green"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} variant="ghost">
            {t('cancel', { defaultValue: 'Hủy' })}
          </Button>
          <Button colorScheme="blue" onClick={onSave} isLoading={isLoading}>
            {t('save', { defaultValue: 'Lưu' })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;

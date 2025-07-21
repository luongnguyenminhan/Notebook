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
} from '@chakra-ui/react';

const CreateUserModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  creating,
  onCreate,
  t,
}: any) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        {t('addUser', { defaultValue: 'Thêm User mới' })}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={3} isRequired>
          <FormLabel>{t('username', { defaultValue: 'Username' })}</FormLabel>
          <Input
            value={form.username}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, username: e.target.value }))
            }
          />
        </FormControl>
        <FormControl mb={3} isRequired>
          <FormLabel>{t('email', { defaultValue: 'Email' })}</FormLabel>
          <Input
            value={form.email}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, email: e.target.value }))
            }
          />
        </FormControl>
        <FormControl mb={3} isRequired>
          <FormLabel>{t('password', { defaultValue: 'Password' })}</FormLabel>
          <Input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f: any) => ({ ...f, password: e.target.value }))
            }
          />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} mr={3} variant="ghost">
          {t('cancel', { defaultValue: 'Hủy' })}
        </Button>
        <Button colorScheme="blue" onClick={onCreate} isLoading={creating}>
          {t('create', { defaultValue: 'Tạo' })}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default CreateUserModal;

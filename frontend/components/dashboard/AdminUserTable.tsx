import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Spinner,
  Button,
  useDisclosure,
  Flex,
  IconButton,
  Tooltip,
  Switch,
  HStack,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleAdmin,
} from '@/services/api/user';
import { useTranslations } from 'next-intl';
import CreateUserModal from '@/components/modal/CreateUserModal';
import EditUserModal from '@/components/modal/EditUserModal';
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal';

const AdminUserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const toast = useTranslations('AdminUserTable');
  const t = useTranslations('AdminUserTable');

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch(() => setError(t('fetchError', { defaultValue: 'Lỗi tải user' })))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createUser(form);
      toast({
        title: t('createSuccess', { defaultValue: 'Tạo user thành công' }),
        status: 'success',
      });
      setForm({ username: '', email: '', password: '' });
      onClose();
      fetchUsers();
    } catch (e: any) {
      toast({
        title: t('createFail', { defaultValue: 'Tạo user thất bại' }),
        status: 'error',
        description: e?.response?.data?.detail || '',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (user: any) => {
    setEditUser({ ...user, password: '' });
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      const data = { ...editUser };
      if (!data.password) delete data.password;
      await updateUser(editUser.id, data);
      toast({
        title: t('editSuccess', { defaultValue: 'Cập nhật user thành công' }),
        status: 'success',
      });
      setEditUser(null);
      fetchUsers();
    } catch (e: any) {
      toast({
        title: t('editFail', { defaultValue: 'Cập nhật user thất bại' }),
        status: 'error',
        description: e?.response?.data?.detail || '',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (userId: number) => {
    setDeleteUserId(userId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    setDeleteLoading(true);
    try {
      await deleteUser(deleteUserId);
      toast({
        title: t('deleteSuccess', { defaultValue: 'Xóa user thành công' }),
        status: 'success',
      });
      setDeleteUserId(null);
      fetchUsers();
    } catch (e: any) {
      toast({
        title: t('deleteFail', { defaultValue: 'Xóa user thất bại' }),
        status: 'error',
        description: e?.response?.data?.detail || '',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleAdmin = async (user: any) => {
    try {
      await toggleAdmin(user.id);
      toast({
        title: t('toggleAdminSuccess', { defaultValue: 'Đã đổi quyền admin' }),
        status: 'success',
      });
      fetchUsers();
    } catch (e: any) {
      toast({
        title: t('toggleAdminFail', {
          defaultValue: 'Đổi quyền admin thất bại',
        }),
        status: 'error',
        description: e?.response?.data?.detail || '',
      });
    }
  };

  if (loading)
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
      </Box>
    );
  if (error)
    return (
      <Box color="red.500" textAlign="center" py={8}>
        {error}
      </Box>
    );
  if (!users.length)
    return (
      <Box textAlign="center" py={8}>
        {t('noUser', { defaultValue: 'Không có user nào' })}
        <Button mt={4} colorScheme="blue" onClick={onOpen}>
          {t('addUser', { defaultValue: 'Thêm User' })}
        </Button>
        <CreateUserModal
          isOpen={isOpen}
          onClose={onClose}
          form={form}
          setForm={setForm}
          creating={creating}
          onCreate={handleCreate}
          t={t}
        />
      </Box>
    );

  return (
    <Box
      w="100%"
      bg="gray.50"
      _dark={{ bg: 'gray.900' }}
      p={{ base: 2, md: 6, lg: 10 }}
      borderRadius="xl"
      boxShadow="xl"
      my={4}
      overflow="auto"
    >
      <Flex justify="flex-end" mb={4}>
        <Button colorScheme="blue" onClick={onOpen}>
          {t('addUser', { defaultValue: 'Thêm User' })}
        </Button>
      </Flex>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>{t('username', { defaultValue: 'Username' })}</Th>
            <Th>{t('email', { defaultValue: 'Email' })}</Th>
            <Th>{t('admin', { defaultValue: 'Admin' })}</Th>
            <Th>{t('recordings', { defaultValue: 'Recordings' })}</Th>
            <Th>{t('storage', { defaultValue: 'Storage' })}</Th>
            <Th>{t('actions', { defaultValue: 'Actions' })}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Switch
                  isChecked={user.is_admin}
                  onChange={() => handleToggleAdmin(user)}
                  colorScheme="green"
                  size="md"
                  title={t('toggleAdmin', { defaultValue: 'Toggle admin' })}
                />
              </Td>
              <Td>{user.recordings_count}</Td>
              <Td>{user.storage_used}</Td>
              <Td>
                <HStack spacing={1}>
                  <Tooltip label={t('edit', { defaultValue: 'Edit' })}>
                    <IconButton
                      aria-label={t('edit', { defaultValue: 'Edit' })}
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEdit(user)}
                    />
                  </Tooltip>
                  <Tooltip label={t('delete', { defaultValue: 'Delete' })}>
                    <IconButton
                      aria-label={t('delete', { defaultValue: 'Delete' })}
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(user.id)}
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <CreateUserModal
        isOpen={isOpen}
        onClose={onClose}
        form={form}
        setForm={setForm}
        creating={creating}
        onCreate={handleCreate}
        t={t}
      />
      <EditUserModal
        user={editUser}
        setUser={setEditUser}
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        onSave={handleEditSave}
        isLoading={editLoading}
        t={t}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteLoading}
        t={t}
      />
    </Box>
  );
};

export default AdminUserTable;

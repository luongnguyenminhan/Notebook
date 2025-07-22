/* eslint-disable react-hooks/exhaustive-deps */
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal';
import CreateUserModal from '@/components/modal/CreateUserModal';
import EditUserModal from '@/components/modal/EditUserModal';
import { showToast } from '@/hooks/useShowToast';
import {
  createUser,
  deleteUser,
  getAllUsers,
  toggleAdmin,
  updateUser,
} from '@/services/api/user';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Spinner,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
      showToast(
        'success',
        t('createSuccess', { defaultValue: 'Tạo user thành công' }),
      );
      setForm({ username: '', email: '', password: '' });
      onClose();
      fetchUsers();
    } catch {
      showToast(
        'error',
        t('createFail', { defaultValue: 'Tạo user thất bại' }),
      );
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
      showToast(
        'success',
        t('editSuccess', { defaultValue: 'Cập nhật user thành công' }),
      );
      setEditUser(null);
      fetchUsers();
    } catch {
      showToast(
        'error',
        t('editFail', { defaultValue: 'Cập nhật user thất bại' }),
      );
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
      showToast(
        'success',
        t('deleteSuccess', { defaultValue: 'Xóa user thành công' }),
      );
      setDeleteUserId(null);
      fetchUsers();
    } catch {
      showToast(
        'error',
        t('deleteFail', { defaultValue: 'Xóa user thất bại' }),
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleAdmin = async (user: any) => {
    try {
      await toggleAdmin(user.id);
      showToast(
        'success',
        t('toggleAdminSuccess', { defaultValue: 'Đổi quyền admin thành công' }),
      );
      fetchUsers();
    } catch {
      showToast(
        'error',
        t('toggleAdminFail', {
          defaultValue: 'Đổi quyền admin thất bại',
        }),
      );
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

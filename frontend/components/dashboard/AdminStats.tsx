import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Flex,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { getAdminStats } from '@/services/api/user';
import { useTranslations } from 'next-intl';

const AdminStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('AdminStats');

  useEffect(() => {
    setLoading(true);
    getAdminStats()
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch(() =>
        setError(t('fetchError', { defaultValue: 'Lỗi tải thống kê' })),
      )
      .finally(() => setLoading(false));
  }, []);

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
  if (!stats)
    return (
      <Box textAlign="center" py={8}>
        {t('noStats', { defaultValue: 'Không có dữ liệu thống kê' })}
      </Box>
    );

  const statusTotal =
    stats.completed_recordings +
    stats.processing_recordings +
    stats.pending_recordings +
    stats.failed_recordings;

  return (
    <Box>
      <Heading as="h3" size="lg" mb={6}>
        {t('title', { defaultValue: 'System Statistics' })}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          label={t('totalUsers', { defaultValue: 'Total Users' })}
          value={stats.total_users}
          color="blue.500"
        />
        <StatCard
          label={t('totalRecordings', { defaultValue: 'Total Recordings' })}
          value={stats.total_recordings}
          color="green.500"
        />
        <StatCard
          label={t('totalStorage', { defaultValue: 'Total Storage' })}
          value={formatFileSize(stats.total_storage)}
          color="purple.500"
        />
        <StatCard
          label={t('totalQueries', { defaultValue: 'Total Queries' })}
          value={stats.total_queries}
          color="orange.500"
        />
      </SimpleGrid>

      <Box mb={8}>
        <Heading as="h4" size="md" mb={4}>
          {t('statusDistribution', {
            defaultValue: 'Recording Status Distribution',
          })}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <StatusCard
            label={t('completed', { defaultValue: 'Completed' })}
            value={stats.completed_recordings}
            total={statusTotal}
            color="green.400"
          />
          <StatusCard
            label={t('processing', { defaultValue: 'Processing' })}
            value={stats.processing_recordings}
            total={statusTotal}
            color="yellow.400"
          />
          <StatusCard
            label={t('pending', { defaultValue: 'Pending' })}
            value={stats.pending_recordings}
            total={statusTotal}
            color="blue.400"
          />
          <StatusCard
            label={t('failed', { defaultValue: 'Failed' })}
            value={stats.failed_recordings}
            total={statusTotal}
            color="red.400"
          />
        </SimpleGrid>
      </Box>

      <Box mb={8}>
        <Heading as="h4" size="md" mb={4}>
          {t('topUsers', { defaultValue: 'Top Users by Storage' })}
        </Heading>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>{t('username', { defaultValue: 'Username' })}</Th>
              <Th>{t('storage', { defaultValue: 'Storage' })}</Th>
              <Th>{t('recordings', { defaultValue: 'Recordings' })}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stats.top_users && stats.top_users.length > 0 ? (
              stats.top_users.map((user: any) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.username}</Td>
                  <Td>{formatFileSize(user.storage_used)}</Td>
                  <Td>{user.recordings_count}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  {t('noTopUsers', { defaultValue: 'No data available' })}
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

function StatCard({ label, value, color }: any) {
  return (
    <Card
      boxShadow="md"
      borderRadius="xl"
      bg="white"
      _dark={{ bg: 'gray.800' }}
    >
      <CardBody>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber color={color}>{value}</StatNumber>
        </Stat>
      </CardBody>
    </Card>
  );
}

function StatusCard({ label, value, total, color }: any) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return (
    <Card
      boxShadow="md"
      borderRadius="xl"
      bg="white"
      _dark={{ bg: 'gray.800' }}
    >
      <CardBody>
        <Text fontWeight="bold" mb={2}>
          {label}
        </Text>
        <StatNumber color={color}>{value}</StatNumber>
        <Progress
          value={percent}
          colorScheme={colorToScheme(color)}
          size="sm"
          borderRadius="md"
          mt={2}
        />
        <Text fontSize="sm" color="gray.500" mt={1}>
          {percent}%
        </Text>
      </CardBody>
    </Card>
  );
}

function colorToScheme(color: string) {
  if (color.includes('green')) return 'green';
  if (color.includes('yellow')) return 'yellow';
  if (color.includes('blue')) return 'blue';
  if (color.includes('red')) return 'red';
  if (color.includes('purple')) return 'purple';
  if (color.includes('orange')) return 'orange';
  return 'gray';
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default AdminStats;

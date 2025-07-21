import React from 'react';
import { Box, Text, Badge, Button, Flex } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

export interface Recording {
  id: string | number;
  title: string;
  participants: string;
  status: 'COMPLETED' | 'PROCESSING' | string;
  meeting_date?: string;
}

interface RecordingDetailProps {
  recording: Recording | null;
  onClose: () => void;
}

const RecordingDetail: React.FC<RecordingDetailProps> = ({
  recording,
  onClose,
}) => {
  const t = useTranslations('RecordingDetail');
  if (!recording) return null;
  return (
    <Box
      mt={6}
      p={5}
      borderWidth={1}
      borderRadius="xl"
      bg="white"
      _dark={{ bg: 'gray.900' }}
    >
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="xl">
          {recording.title}
        </Text>
        <Button size="sm" onClick={onClose}>
          {t('close', { defaultValue: 'Đóng' })}
        </Button>
      </Flex>
      <Text mt={2}>
        {t('participants', { defaultValue: 'Tham gia:' })}{' '}
        {recording.participants}
      </Text>
      <Text>
        {t('date', { defaultValue: 'Ngày:' })} {recording.meeting_date}
      </Text>
      <Badge
        mt={2}
        colorScheme={
          recording.status === 'COMPLETED'
            ? 'green'
            : recording.status === 'PROCESSING'
              ? 'yellow'
              : 'gray'
        }
      >
        {t(recording.status.toLowerCase(), { defaultValue: recording.status })}
      </Badge>
      {/* Thêm các nút edit, xóa, share nếu cần */}
    </Box>
  );
};

export default RecordingDetail;

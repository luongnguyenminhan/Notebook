import React from 'react';
import { VStack, Box, Text, Badge } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

const RecordingList = ({ recordings, onSelect, selectedId }) => {
  const t = useTranslations('RecordingList');
  if (!recordings || recordings.length === 0)
    return (
      <Text color="gray.400">
        {t('noData', { defaultValue: 'Không có bản ghi' })}
      </Text>
    );
  return (
    <VStack align="stretch" spacing={2}>
      {recordings.map((r) => (
        <Box
          key={r.id}
          p={3}
          borderRadius="lg"
          borderWidth={selectedId === r.id ? 2 : 1}
          borderColor={selectedId === r.id ? 'blue.400' : 'gray.200'}
          bg={selectedId === r.id ? 'blue.50' : 'white'}
          _dark={{
            bg: selectedId === r.id ? 'blue.900' : 'gray.800',
            borderColor: selectedId === r.id ? 'blue.400' : 'gray.700',
          }}
          cursor="pointer"
          onClick={() => onSelect(r)}
        >
          <Text fontWeight="bold">{r.title}</Text>
          <Text fontSize="sm" color="gray.500">
            {r.participants}
          </Text>
          <Badge
            colorScheme={
              r.status === 'COMPLETED'
                ? 'green'
                : r.status === 'PROCESSING'
                  ? 'yellow'
                  : 'gray'
            }
          >
            {t(r.status.toLowerCase(), { defaultValue: r.status })}
          </Badge>
        </Box>
      ))}
    </VStack>
  );
};
export default RecordingList;

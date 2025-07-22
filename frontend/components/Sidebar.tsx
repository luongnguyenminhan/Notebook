/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Box,
  Flex,
  Button,
  Spinner,
  Text,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { RecordingResponse } from '@/services/api/recording';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTimestampWithHour } from '@/lib/utils/utils';

interface SidebarProps {
  recordings: RecordingResponse[];
  loading: boolean;
  onUpload: () => void;
  onSelect: (rec: RecordingResponse) => void;
  selectedId?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  recordings,
  loading,
  onUpload,
  onSelect,
  selectedId,
}) => {
  const t = useTranslations('UserSidebar');

  // Filter + sort using backend fields
  const sorted = [...recordings].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );

  return (
    <Box
      as="aside"
      bg="var(--input-bg-light)"
      _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
      h="100%"
      display="flex"
      flexDirection="column"
      className="backdrop-blur-md border-r border-gray-300"
      style={{
        boxShadow: '0 8px 32px 0 var(--shadow-color)',
      }}
    >
      <Box
        className="sidebar-content-wrapper"
        display="flex"
        flexDirection="column"
        h="full"
      >
        {/* Header */}
        <Box
          p={4}
          borderBottom="none"
          flexShrink={0}
          style={{ position: 'sticky', top: 0, zIndex: 10 }}
        >
          <Flex align="center" justify="space-between" mb={4}>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="var(--text-color-light)"
              _dark={{ color: 'var(--text-color-dark)' }}
            >
              {t('recordings', { defaultValue: 'Recordings' })}
            </Text>
            <Button
              size="sm"
              leftIcon={<AddIcon />}
              onClick={onUpload}
              borderRadius="xl"
              boxShadow="md"
              style={{
                background: '#0070f3',
                color: '#fff',
                boxShadow: '0 2px 8px 0 rgba(0,112,243,0.10)',
                fontWeight: 600,
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
              {t('upload', { defaultValue: 'New Upload' })}
            </Button>
          </Flex>
        </Box>
        <Box flex="1" overflowY="auto" p={4}>
          {loading ? (
            <Flex justify="center" align="center" minH="120px">
              <Spinner size="lg" />
            </Flex>
          ) : recordings.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              py={8}
              color="var(--text-color-light)"
              _dark={{ color: 'var(--text-color-dark)' }}
            >
              <FaMicrophoneAlt size={10} />
              <Text>
                {t('noRecordings', { defaultValue: 'No recordings' })}
              </Text>
            </Flex>
          ) : (
            <VStack align="stretch" spacing={2}>
              <AnimatePresence>
                {sorted.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Box
                      p={2}
                      borderRadius="xl"
                      boxShadow={
                        selectedId === r.id
                          ? '0 3px 3px 0 #0070f3'
                          : '0 3px 3px 0 #aaa'
                      }
                      bg={selectedId === r.id ? '#fff' : '#fff'}
                      color="var(--text-color-light)"
                      _dark={{
                        bg:
                          selectedId === r.id
                            ? '#3ab0ff'
                            : 'var(--input-bg-dark)',
                        color: 'var(--text-color-dark)',
                      }}
                      cursor="pointer"
                      onClick={() => onSelect(r)}
                      transition="all 0.2s"
                      _hover={{
                        filter: 'brightness(1.04)',
                        transform: 'scale(1.02)',
                      }}
                      border="none"
                    >
                      <Text fontWeight="bold" fontSize={'sm'}>
                        {r.filename}
                      </Text>
                      {/* <Text
                        fontSize="sm"
                        color="var(--text-color-light)"
                        _dark={{ color: 'var(--text-color-dark)' }}
                      >
                        User: {r.user_id}
                      </Text> */}
                      <Text fontSize="xs" color="gray.400">
                        {formatTimestampWithHour(r.created_at)}
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;

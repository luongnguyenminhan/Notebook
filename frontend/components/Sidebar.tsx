/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Input,
  IconButton,
  Spinner,
  Text,
  VStack,
  Collapse,
  Badge,
} from '@chakra-ui/react';
import {
  AddIcon,
  SearchIcon,
  CalendarIcon,
  ArrowUpDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { FaMicrophoneAlt } from 'react-icons/fa';
import { RecordingResponse } from '@/services/api/recording';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'meeting_date'>(
    'created_at',
  );
  const [showTips, setShowTips] = useState(false);

  // Filter + sort using backend fields
  const filtered = recordings.filter((r) =>
    r.filename.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) =>
    sortBy === 'created_at'
      ? b.created_at.localeCompare(a.created_at)
      : (b.created_at || '').localeCompare(a.created_at || ''),
  );

  return (
    <Box
      as="aside"
      w={{ base: '64', md: '72' }}
      bg="var(--input-bg-light)"
      _dark={{ bg: 'var(--input-bg-dark)' }}
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
        <Box p={4} borderBottom="none" flexShrink={0}>
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
          {/* <VStack align="stretch" spacing={3}>
            <Box position="relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search', { defaultValue: 'Search...' })}
                pl={9}
                pr={8}
                size="md"
                bg="var(--input-bg-light)"
                color="var(--text-color-light)"
                _dark={{
                  bg: 'var(--input-bg-dark)',
                  color: 'var(--text-color-dark)',
                }}
                border="none"
                borderRadius="xl"
                boxShadow="sm"
                _focus={{
                  boxShadow: '0 0 0 3px var(--primary-color)',
                  transform: 'scale(1.03)',
                }}
                transition="all 0.2s"
              />
              <SearchIcon
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="var(--text-color-light)"
                _dark={{ color: 'var(--text-color-dark)' }}
                fontSize="sm"
              />
              {search && (
                <IconButton
                  aria-label="clear"
                  icon={<ChevronUpIcon />}
                  size="xs"
                  variant="ghost"
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  color="var(--text-color-light)"
                  _dark={{ color: 'var(--text-color-dark)' }}
                  onClick={() => setSearch('')}
                />
              )}
            </Box>
            <Button
              size="sm"
              w="full"
              leftIcon={
                sortBy === 'meeting_date' ? (
                  <CalendarIcon />
                ) : (
                  <ArrowUpDownIcon />
                )
              }
              rightIcon={<ArrowUpDownIcon />}
              onClick={() =>
                setSortBy(
                  sortBy === 'created_at' ? 'meeting_date' : 'created_at',
                )
              }
              bg="var(--input-bg-light)"
              color="var(--text-color-light)"
              _dark={{
                bg: 'var(--input-bg-dark)',
                color: 'var(--text-color-dark)',
              }}
              border="none"
              borderRadius="xl"
              boxShadow="sm"
              _hover={{ filter: 'brightness(1.05)', transform: 'scale(1.02)' }}
              transition="all 0.2s"
            >
              {t('sort', { defaultValue: 'Sort' })} :{' '}
              {sortBy === 'meeting_date'
                ? t('meetingDate', { defaultValue: 'Meeting Date' })
                : t('uploadDate', { defaultValue: 'Upload Date' })}
            </Button>
            <Box
              fontSize="xs"
              color="var(--text-color-light)"
              _dark={{ color: 'var(--text-color-dark)' }}
            >
              <Button
                variant="link"
                size="xs"
                onClick={() => setShowTips((v) => !v)}
                rightIcon={showTips ? <ChevronUpIcon /> : <ChevronDownIcon />}
              >
                {t('tips', { defaultValue: 'Tip: date:today, date:thisweek' })}
              </Button>
              <Collapse in={showTips} animateOpacity>
                <Box pl={2} pt={1}>
                </Box>
              </Collapse>
            </Box>
          </VStack> */}
        </Box>
        <Box flex="1" overflowY="auto" p={4}>
          {loading ? (
            <Flex justify="center" align="center" minH="120px">
              <Spinner size="lg" />
            </Flex>
          ) : sorted.length === 0 ? (
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
                      p={3}
                      borderRadius="2xl"
                      boxShadow={
                        selectedId === r.id
                          ? '0 4px 4px 0 #0070f3'
                          : '0 4px 4px 0 #aaa'
                      }
                      bg={
                        selectedId === r.id
                          ? '#fff'
                          : '#fff'
                      }
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
                      <Text fontWeight="bold">{r.filename}</Text>
                      <Text
                        fontSize="sm"
                        color="var(--text-color-light)"
                        _dark={{ color: 'var(--text-color-dark)' }}
                      >
                        User: {r.user_id}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {r.created_at}
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

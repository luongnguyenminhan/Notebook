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
  const t = useTranslations('Sidebar');
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
      _dark={{
        bg: 'var(--input-bg-dark)',
        borderColor: 'var(--input-border-dark)',
      }}
      h="100vh"
      display="flex"
      flexDirection="column"
      borderRight="1px"
      borderColor="var(--input-border-light)"
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
          borderBottom="1px"
          borderColor="var(--border-primary)"
          flexShrink={0}
        >
          <Flex align="center" justify="space-between" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">
              {t('recordings', { defaultValue: 'Recordings' })}
            </Text>
            <Button
              size="sm"
              colorScheme="blue"
              leftIcon={<AddIcon />}
              onClick={onUpload}
            >
              {t('new', { defaultValue: 'New' })}
            </Button>
          </Flex>
          <VStack align="stretch" spacing={3}>
            {/* Search */}
            <Box position="relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search', {
                  defaultValue: 'Search recordings...',
                })}
                pl={9}
                pr={8}
                size="sm"
                bg="var(--bg-input)"
                borderColor="var(--border-secondary)"
                rounded="lg"
                _focus={{ ring: 2, ringColor: 'var(--ring-focus)' }}
              />
              <SearchIcon
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
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
                  color="gray.400"
                  onClick={() => setSearch('')}
                />
              )}
            </Box>
            {/* Sort */}
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
              bg="var(--bg-input)"
              borderColor="var(--border-secondary)"
              rounded="lg"
              _hover={{ bg: 'var(--bg-tertiary)' }}
            >
              {t('sort', { defaultValue: 'Sort by:' })}{' '}
              {sortBy === 'meeting_date'
                ? t('meetingDate', { defaultValue: 'Meeting Date' })
                : t('uploadDate', { defaultValue: 'Upload Date' })}
            </Button>
            {/* Tips */}
            <Box fontSize="xs" color="gray.500">
              <Button
                variant="link"
                size="xs"
                onClick={() => setShowTips((v) => !v)}
                rightIcon={showTips ? <ChevronUpIcon /> : <ChevronDownIcon />}
              >
                {t('tips', { defaultValue: 'Search tips:' })}
              </Button>
              <Collapse in={showTips} animateOpacity>
                <Box pl={2} pt={1}>
                  {/* Add tips if needed */}
                </Box>
              </Collapse>
            </Box>
          </VStack>
        </Box>
        {/* List */}
        <Box flex="1" overflowY="auto" p={4}>
          {loading ? (
            <Flex justify="center" align="center" minH="120px">
              <Spinner size="lg" />
            </Flex>
          ) : sorted.length === 0 ? (
            <Flex direction="column" align="center" py={8} color="gray.400">
              <FaMicrophoneAlt size={10} />
              <Text>
                {t('noRecordings', { defaultValue: 'No recordings found' })}
              </Text>
            </Flex>
          ) : (
            <VStack align="stretch" spacing={2}>
              {sorted.map((r) => (
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
                  transition="all 0.2s"
                >
                  <Text fontWeight="bold">{r.filename}</Text>
                  <Text fontSize="sm" color="gray.500">
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
                    {r.status}
                  </Badge>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;

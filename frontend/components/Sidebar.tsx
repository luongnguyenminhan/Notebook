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
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { FaInbox, FaMicrophoneAlt } from 'react-icons/fa';

interface Recording {
  id: number;
  title: string;
  status: string;
  participants?: string;
  created_at: string;
  meeting_date: string;
  is_highlighted?: boolean;
  is_inbox?: boolean;
}

interface SidebarProps {
  recordings: Recording[];
  loading: boolean;
  onUpload: () => void;
  onSelect: (rec: Recording) => void;
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

  // Filter + sort mock
  const filtered = recordings.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) =>
    sortBy === 'created_at'
      ? b.created_at.localeCompare(a.created_at)
      : b.meeting_date.localeCompare(a.meeting_date),
  );

  return (
    <Box
      as="aside"
      w={{ base: '64', md: '72' }}
      bg="var(--input-bg-light)"
      _dark={{ bg: 'var(--input-bg-dark)', borderColor: 'var(--input-border-dark)' }}
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
                  <div>
                    •{' '}
                    <code className="bg-[var(--bg-tertiary)] px-1 rounded">
                      date:today
                    </code>{' '}
                    - {t('today', { defaultValue: "Today's recordings" })}
                  </div>
                  <div>
                    •{' '}
                    <code className="bg-[var(--bg-tertiary)] px-1 rounded">
                      date:2025-01
                    </code>{' '}
                    - {t('january', { defaultValue: 'January 2025' })}
                  </div>
                  <div>
                    •{' '}
                    <code className="bg-[var(--bg-tertiary)] px-1 rounded">
                      date:thisweek
                    </code>{' '}
                    - {t('thisweek', { defaultValue: 'This week' })}
                  </div>
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
                  <Flex align="start" justify="space-between">
                    <Box flex="1" minW={0}>
                      <Text
                        fontWeight="medium"
                        fontSize="sm"
                        isTruncated
                        color={
                          selectedId === r.id
                            ? 'var(--text-accent)'
                            : 'var(--text-primary)'
                        }
                      >
                        {r.title ||
                          t('untitled', { defaultValue: 'Untitled Recording' })}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {r.participants}
                      </Text>
                    </Box>
                    <Flex align="center" gap={1} ml={2}>
                      {r.status === 'FAILED' && (
                        <Badge colorScheme="red">
                          <WarningIcon mr={1} />
                          {t('failed', { defaultValue: 'Failed' })}
                        </Badge>
                      )}
                      {r.status !== 'COMPLETED' && r.status !== 'FAILED' && (
                        <Badge colorScheme="yellow">
                          {t(r.status.toLowerCase(), {
                            defaultValue: r.status,
                          })}
                        </Badge>
                      )}
                      {r.status === 'COMPLETED' && (
                        <>
                          {r.is_highlighted && (
                            <StarIcon color="yellow.400" />
                          )}
                          {r.is_inbox && (
                            <FaInbox color="blue.400" />
                          )}
                        </>
                      )}
                    </Flex>
                  </Flex>
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

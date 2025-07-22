import React from 'react';
import { Box, Flex, Text, IconButton, Badge } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp, FaStar, FaRedoAlt, FaSyncAlt, FaUserTag, FaTrash, FaCalendar } from 'react-icons/fa';

interface MobileHeaderProps {
  selectedRecording: any;
  metaOpen: boolean;
  setMetaOpen: (v: boolean) => void;
  onToggleHighlight?: () => void;
  onReprocessTranscription?: () => void;
  onReprocessSummary?: () => void;
  onSpeakerModal?: () => void;
  onDelete?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  selectedRecording,
  metaOpen,
  setMetaOpen,
  onToggleHighlight,
  onReprocessTranscription,
  onReprocessSummary,
  onDelete,
}) => (
  <Box
    bg="var(--input-bg-light)"
    _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
    borderBottom="1px solid"
    borderColor="gray.200"
    p={4}
    flexShrink={0}
    borderRadius="0 0 1.5rem 1.5rem"
    boxShadow="0 2px 8px 0 rgba(0,0,0,0.04)"
  >
    <Box onClick={() => setMetaOpen(!metaOpen)} cursor="pointer">
      <Flex align="start" justify="space-between">
        <Box flex="1" minW={0}>
          <Text fontSize="lg" fontWeight="bold" color="var(--text-color-light)" _dark={{ color: 'var(--text-color-dark)' }} isTruncated>
            {selectedRecording.title || selectedRecording.filename || 'Untitled Recording'}
          </Text>
          <Text fontSize="sm" color="var(--text-color-light)" _dark={{ color: 'var(--text-color-dark)' }} isTruncated>
            {selectedRecording.original_filename || 'No original filename'}
          </Text>
        </Box>
        <Box as={metaOpen ? FaChevronUp : FaChevronDown} fontSize="lg" />
      </Flex>
    </Box>
    {metaOpen && (
      <Box mt={4}>
        <Flex align="center" gap={2} color="var(--text-color-light)" _dark={{ color: 'var(--text-color-dark)' }} fontSize="sm">
          <FaCalendar color="#0070f3" />
          <span>
            {selectedRecording.created_at ? new Date(selectedRecording.created_at).toLocaleString() : 'No date set'}
          </span>
        </Flex>
        <Flex align="center" gap={2} mt={2}>
          {selectedRecording.status && selectedRecording.status !== 'COMPLETED' && (
            <Badge colorScheme="yellow" borderRadius="xl" px={2} py={1} fontSize="xs">
              {selectedRecording.status}
            </Badge>
          )}
        </Flex>
        <Flex gap={2} mt={4} wrap="wrap">
          <IconButton aria-label="Star" icon={<FaStar />} onClick={onToggleHighlight} color={selectedRecording.is_highlighted ? '#ffd600' : undefined} />
          <IconButton aria-label="Reprocess" icon={<FaRedoAlt />} onClick={onReprocessTranscription} />
          <IconButton aria-label="Summary" icon={<FaSyncAlt />} onClick={onReprocessSummary} />
          <IconButton aria-label="Delete" icon={<FaTrash />} onClick={onDelete} color="#f44336" />
        </Flex>
      </Box>
    )}
  </Box>
);

export default MobileHeader;

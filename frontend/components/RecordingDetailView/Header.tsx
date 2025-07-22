import React from 'react';
import { Box, Flex, Text, IconButton, Badge } from '@chakra-ui/react';
import { FaStar, FaEdit, FaRedoAlt, FaSyncAlt, FaUndo, FaUserTag, FaTrash, FaUsers, FaCalendar } from 'react-icons/fa';

interface HeaderProps {
  selectedRecording: any;
  onToggleHighlight?: () => void;
  onEdit?: () => void;
  onReprocessTranscription?: () => void;
  onReprocessSummary?: () => void;
  onReset?: () => void;
  onSpeakerModal?: () => void;
  onDelete?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  selectedRecording,
  onToggleHighlight,
  onEdit,
  onReprocessTranscription,
  onReprocessSummary,
  onDelete,
}) => (
  <Box
    bg="var(--input-bg-light)"
    _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
    borderBottom="1px solid"
    borderColor="gray.200"
    p={6}
    flexShrink={0}
    borderRadius="0 0 1.5rem 1.5rem"
    boxShadow="0 2px 8px 0 rgba(0,0,0,0.04)"
  >
    <Flex align="start" justify="space-between">
      <Box flex="1" minW={0}>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="var(--text-color-light)"
          _dark={{ color: 'var(--text-color-dark)' }}
          mb={2}
        >
          {selectedRecording.title ||
            selectedRecording.filename ||
            'Untitled Recording'}
        </Text>
      </Box>
      <Flex gap={2} ml={4} wrap="wrap">
        <IconButton
          aria-label="Star"
          icon={<FaStar />}
          onClick={onToggleHighlight}
          color={selectedRecording.is_highlighted ? '#ffd600' : undefined}
        />
        <IconButton aria-label="Edit" icon={<FaEdit />} onClick={onEdit} />
        <IconButton
          aria-label="Reprocess"
          icon={<FaRedoAlt />}
          onClick={onReprocessTranscription}
        />
        <IconButton
          aria-label="Summary"
          icon={<FaSyncAlt />}
          onClick={onReprocessSummary}
        />
        <IconButton
          aria-label="Delete"
          icon={<FaTrash />}
          onClick={onDelete}
          color="#f44336"
        />
      </Flex>
    </Flex>
    {/* Metadata Row */}
    <Flex
      flexWrap="wrap"
      align="center"
      gap={6}
      fontSize="sm"
      color="var(--text-color-light)"
      _dark={{ color: 'var(--text-color-dark)' }}
      mt={2}
    >
      <Flex align="center" gap={2}>
        <FaUsers color="#0070f3" />
        {selectedRecording.original_filename || 'No original filename'}
      </Flex>
      <Flex align="center" gap={2}>
        <FaCalendar color="#0070f3" />
        {selectedRecording.created_at
          ? new Date(selectedRecording.created_at).toLocaleString()
          : 'No date set'}
      </Flex>
      {selectedRecording.status &&
        selectedRecording.status !== 'COMPLETED' && (
          <Badge
            colorScheme="yellow"
            borderRadius="xl"
            px={2}
            py={1}
            fontSize="xs"
          >
            {selectedRecording.status}
          </Badge>
        )}
    </Flex>
  </Box>
);

export default Header;

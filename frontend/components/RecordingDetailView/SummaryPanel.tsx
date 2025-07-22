import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import SimpleMarkDownEditor from '../SimpleMarkDownEditor';
import { FaEdit } from 'react-icons/fa';

interface SummaryPanelProps {
  summary: string;
  editingSummary: boolean;
  setEditingSummary: (value: boolean) => void;
  setSummary: (value: string) => void;
  formatMeetingNoteForDisplay: (noteText: string) => string;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  summary,
  editingSummary,
  setEditingSummary,
  setSummary,
  formatMeetingNoteForDisplay,
}) => {
  return editingSummary ? (
    <Box>
      <Flex justify="end" gap={2} mb={2}>
        <Button
          size="sm"
          onClick={() => setEditingSummary(false)}
          bg="#eee"
          color="#1a202c"
          borderRadius="xl"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          bg="#0070f3"
          color="#fff"
          borderRadius="xl"
          onClick={() => setEditingSummary(false)}
          _hover={{ bg: '#339dff' }}
        >
          Save
        </Button>
      </Flex>
      <SimpleMarkDownEditor
        initialValue={summary}
        onChange={setSummary}
        mode="edit"
        height="50vh"
        placeholder="Nhập tóm tắt dạng markdown..."
      />
    </Box>
  ) : (
    <Box>
      <Button
        size="sm"
        leftIcon={<FaEdit />}
        bg="#0070f3"
        color="#fff"
        borderRadius="xl"
        _hover={{ bg: '#339dff' }}
        onClick={() => setEditingSummary(true)}
      >
        Edit
      </Button>
      <Box
        dangerouslySetInnerHTML={{
          __html: formatMeetingNoteForDisplay(summary),
        }}
      />
    </Box>
  );
};

export default SummaryPanel;

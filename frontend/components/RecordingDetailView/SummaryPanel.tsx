import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import SimpleMarkDownEditor from '../SimpleMarkDownEditor';

interface SummaryPanelProps {
  summary: string;
  editingSummary: boolean;
  setEditingSummary: (v: boolean) => void;
  setSummary: (v: string) => void;
  formatMeetingNoteForDisplay: (noteText: string) => string;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ summary, editingSummary, setEditingSummary, setSummary, formatMeetingNoteForDisplay }) => {
  return editingSummary ? (
    <Box>
      <SimpleMarkDownEditor
        initialValue={summary}
        onChange={setSummary}
        mode="edit"
        height="50vh"
        placeholder="Nhập tóm tắt dạng markdown..."
      />
      <Flex justify="end" gap={2} mt={2}>
        <Button size="sm" onClick={() => setEditingSummary(false)} bg="#eee" color="#1a202c" borderRadius="xl">Cancel</Button>
        <Button size="sm" bg="#0070f3" color="#fff" borderRadius="xl" onClick={() => setEditingSummary(false)} _hover={{ bg: '#339dff' }}>Save</Button>
      </Flex>
    </Box>
  ) : (
    <Box>
      <Button size="sm" onClick={() => setEditingSummary(true)} mb={2} bg="#0070f3" color="#fff" borderRadius="xl" _hover={{ bg: '#339dff' }}>Edit</Button>
      <Box dangerouslySetInnerHTML={{ __html: formatMeetingNoteForDisplay(summary) }} />
    </Box>
  );
};

export default SummaryPanel;

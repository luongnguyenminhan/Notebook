/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import SimpleMarkDownEditor from '../SimpleMarkDownEditor';

interface NotesPanelProps {
  notes: string;
  editingNotes: boolean;
  setEditingNotes: (value: boolean) => void;
  setNotes: (value: string) => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  editingNotes,
  setEditingNotes,
  setNotes,
}) => {
  return editingNotes ? (
    <Box>
      <SimpleMarkDownEditor
        initialValue={notes}
        onChange={setNotes}
        mode="edit"
        height="200px"
        placeholder="Nhập ghi chú dạng markdown..."
      />
      <Flex justify="end" gap={2} mt={2}>
        <Button
          size="sm"
          onClick={() => setEditingNotes(false)}
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
          onClick={() => setEditingNotes(false)}
          _hover={{ bg: '#339dff' }}
        >
          Save
        </Button>
      </Flex>
    </Box>
  ) : (
    <Box>
      <Button
        size="sm"
        onClick={() => setEditingNotes(true)}
        mb={2}
        bg="#0070f3"
        color="#fff"
        borderRadius="xl"
        _hover={{ bg: '#339dff' }}
      >
        Edit
      </Button>
      <Box>
        {notes || (
          <Text color="var(--text-color-light)">No notes available</Text>
        )}
      </Box>
    </Box>
  );
};

export default NotesPanel;

import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { FaMicrophone, FaPlus } from 'react-icons/fa';

interface EmptyStateViewProps {
  onUpload: () => void;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onUpload }) => (
  <Flex flex="1" align="center" justify="center">
    <Box textAlign="center">
      <Box as={FaMicrophone} fontSize="6xl" color="var(--text-muted)" mb={4} mx="auto" />
      <Text fontSize="2xl" fontWeight="bold" mb={2}>Select a Recording</Text>
      <Text color="var(--text-muted)" mb={6}>Choose a recording from the sidebar to view its transcription and summary</Text>
      <Button
        leftIcon={<FaPlus style={{ marginRight: 8 }} />}
        px={6}
        py={3}
        bg="var(--bg-button)"
        color="var(--text-button)"
        rounded="lg"
        _hover={{ bg: 'var(--bg-button-hover)' }}
        onClick={onUpload}
      >
        Upload New Recording
      </Button>
    </Box>
  </Flex>
);

export default EmptyStateView; 
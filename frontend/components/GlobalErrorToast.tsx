import React from 'react';
import { Box, Flex, Text, IconButton } from '@chakra-ui/react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';

interface GlobalErrorToastProps {
  error: string | null;
  onClose: () => void;
}

const GlobalErrorToast: React.FC<GlobalErrorToastProps> = ({ error, onClose }) => {
  if (!error) return null;
  return (
    <Box position="fixed" top={4} right={4} bg="var(--bg-danger)" color="white" p={4} borderRadius="lg" shadow="lg" zIndex={9999} maxW="md">
      <Flex align="start" gap={3}>
        <Box as={FaExclamationCircle} fontSize="lg" flexShrink={0} mt={0.5} />
        <Box flex={1}>
          <Text fontWeight="medium">Error</Text>
          <Text fontSize="sm" opacity={0.9}>{error}</Text>
        </Box>
        <IconButton aria-label="close" icon={<FaTimes />} size="sm" variant="ghost" color="white" onClick={onClose} _hover={{ color: 'gray.200' }} />
      </Flex>
    </Box>
  );
};

export default GlobalErrorToast; 
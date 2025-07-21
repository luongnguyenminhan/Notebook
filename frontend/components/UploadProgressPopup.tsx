import React from 'react';
import { Box, Flex, Text, IconButton, Progress } from '@chakra-ui/react';
import {
  FaUpload,
  FaChevronUp,
  FaChevronDown,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';

interface FileItem {
  clientId: string;
  file: { name: string };
  status: 'completed' | 'failed';
}

interface UploadProgressPopupProps {
  uploadQueue: any[];
  progressPopupClosed: boolean;
  progressPopupMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  currentlyProcessingFile?: { file: { name: string } };
  processingProgress?: number;
  processingMessage?: string;
  finishedFilesInQueue: FileItem[];
  completedInQueue: number;
  totalInQueue: number;
}

const UploadProgressPopup: React.FC<UploadProgressPopupProps> = ({
  uploadQueue,
  progressPopupClosed,
  progressPopupMinimized,
  onClose,
  onMinimize,
  currentlyProcessingFile,
  processingProgress = 0,
  processingMessage = '',
  finishedFilesInQueue,
  completedInQueue,
  totalInQueue,
}) => {
  if (uploadQueue.length === 0 || progressPopupClosed) return null;
  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      zIndex={1000}
      className={
        progressPopupMinimized ? 'progress-popup minimized' : 'progress-popup'
      }
    >
      <Box
        bg="var(--bg-secondary)"
        borderWidth={1}
        borderColor="var(--border-primary)"
        borderRadius="lg"
        shadow="lg"
        overflow="hidden"
      >
        {/* Header */}
        <Flex
          bg="var(--bg-tertiary)"
          px={4}
          py={3}
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap={2}>
            <Box as={FaUpload} color="var(--text-accent)" />
            <Text fontWeight="medium">Upload Progress</Text>
            <Text fontSize="sm" color="var(--text-muted)">
              ({completedInQueue}/{totalInQueue})
            </Text>
          </Flex>
          <Flex align="center" gap={2}>
            <IconButton
              aria-label="minimize"
              icon={
                progressPopupMinimized ? <FaChevronUp /> : <FaChevronDown />
              }
              size="sm"
              variant="ghost"
              onClick={onMinimize}
            />
            <IconButton
              aria-label="close"
              icon={<FaTimes />}
              size="sm"
              variant="ghost"
              color="var(--text-danger)"
              onClick={onClose}
            />
          </Flex>
        </Flex>
        {/* Content */}
        {!progressPopupMinimized && (
          <Box p={4} maxH={64} overflowY="auto">
            {currentlyProcessingFile && (
              <Box mb={4} p={3} bg="var(--bg-accent)" borderRadius="lg">
                <Flex align="center" justify="space-between" mb={2}>
                  <Text fontWeight="medium" isTruncated minW={0}>
                    {currentlyProcessingFile.file.name}
                  </Text>
                  <Text fontSize="sm" ml={2}>
                    {processingProgress}%
                  </Text>
                </Flex>
                <Progress
                  value={processingProgress}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                />
                <Text fontSize="sm" color="var(--text-muted)" mt={1}>
                  {processingMessage}
                </Text>
              </Box>
            )}
            {finishedFilesInQueue.length > 0 && (
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="var(--text-secondary)"
                >
                  Completed
                </Text>
                {finishedFilesInQueue.map((item) => (
                  <Flex
                    key={item.clientId}
                    align="center"
                    p={2}
                    bg="var(--bg-tertiary)"
                    borderRadius="md"
                    mt={2}
                  >
                    <Box
                      as={
                        item.status === 'completed'
                          ? FaCheckCircle
                          : FaExclamationCircle
                      }
                      color={
                        item.status === 'completed' ? 'green.500' : 'red.500'
                      }
                      mr={2}
                    />
                    <Text flex={1} isTruncated>
                      {item.file.name}
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        item.status === 'completed' ? 'green.600' : 'red.600'
                      }
                      ml={2}
                    >
                      {item.status === 'completed' ? 'Done' : 'Failed'}
                    </Text>
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UploadProgressPopup;

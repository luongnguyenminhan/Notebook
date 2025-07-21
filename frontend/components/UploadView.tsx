/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Divider,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  FaMicrophone,
  FaCloudUploadAlt,
  FaDesktop,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { uploadRecordingFile } from '@/services/api/recording';

interface UploadViewProps {
  onFileSelect?: (files: FileList) => void;
  onStartRecording?: (mode: 'microphone' | 'system' | 'both') => void;
  canRecordSystemAudio?: boolean;
  showSystemAudioHelp?: () => void;
}

const UploadView: React.FC<UploadViewProps> = ({
  onFileSelect,
  onStartRecording,
  canRecordSystemAudio = true,
  showSystemAudioHelp,
}) => {
  const [dragover, setDragover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    if (onFileSelect && e.dataTransfer.files.length) {
      onFileSelect(e.dataTransfer.files);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragover(true);
  };
  const handleDragLeave = () => setDragover(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileSelect && e.target.files) onFileSelect(e.target.files);
  };

  const handleUpload = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      // Only upload the first file for demo
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      // You may need to add more fields depending on backend
      await uploadRecordingFile(formData);
      toast({ title: 'Upload successful', status: 'success' });
    } catch {
      toast({ title: 'Upload failed', status: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Flex flex="1" align="center" justify="center" p={{ base: 4, md: 8 }}>
      <Box maxW="lg" w="full">
        <Box textAlign="center" mb={8}>
          <Box
            as={FaMicrophone}
            fontSize={{ base: '5xl', md: '6xl' }}
            color="var(--text-accent)"
            mb={4}
            mx="auto"
          />
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" mb={2}>
            Upload or Record Audio
          </Text>
          <Text color="var(--text-muted)">
            Drag and drop an audio file, click to browse, or start a new
            recording.
          </Text>
        </Box>
        <Box
          bg="var(--bg-secondary)"
          p={6}
          borderRadius="xl"
          borderWidth={1}
          borderColor="var(--border-primary)"
        >
          {/* File Upload Area */}
          <Box
            border="2px dashed"
            borderColor={
              dragover ? 'var(--border-accent)' : 'var(--border-secondary)'
            }
            bg={dragover ? 'var(--bg-accent)' : 'transparent'}
            borderRadius="xl"
            p={8}
            textAlign="center"
            cursor="pointer"
            transition="all 0.2s"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Box
              as={FaCloudUploadAlt}
              fontSize="3xl"
              color="gray.400"
              mb={3}
              mx="auto"
            />
            <Text color="var(--text-secondary)" mb={2}>
              Click to upload or drag and drop
            </Text>
            <Text fontSize="xs" color="var(--text-muted)">
              Supports MP3, WAV, M4A, AMR, and more
            </Text>
            <Input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              display="none"
              onChange={handleFileChange}
            />
          </Box>
          <Button
            mt={4}
            colorScheme="blue"
            w="full"
            onClick={handleUpload}
            isLoading={uploading}
          >
            Upload
          </Button>
          {/* Divider */}
          <Flex align="center" my={6}>
            <Divider flex={1} borderColor="var(--border-secondary)" />
            <Text
              mx={4}
              fontSize="xs"
              color="var(--text-muted)"
              textTransform="uppercase"
            >
              Or
            </Text>
            <Divider flex={1} borderColor="var(--border-secondary)" />
          </Flex>
          {/* Audio Recording Options */}
          <Box>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="var(--text-secondary)"
              textAlign="center"
              mb={3}
            >
              Recording Options
            </Text>
            <VStack spacing={3}>
              <Button
                w="full"
                leftIcon={<FaMicrophone />}
                colorScheme="red"
                onClick={() => onStartRecording?.('microphone')}
              >
                Record Microphone
              </Button>
              {canRecordSystemAudio && (
                <Button
                  w="full"
                  leftIcon={<FaDesktop />}
                  colorScheme="blue"
                  onClick={() => onStartRecording?.('system')}
                >
                  Record System Audio
                </Button>
              )}
              {canRecordSystemAudio && (
                <Button
                  w="full"
                  leftIcon={
                    <>
                      <FaMicrophone />
                      <FaDesktop style={{ marginLeft: 4 }} />
                    </>
                  }
                  colorScheme="purple"
                  onClick={() => onStartRecording?.('both')}
                >
                  Record Both
                </Button>
              )}
            </VStack>
            {/* Help Text */}
            <Box fontSize="xs" color="var(--text-muted)" mt={3}>
              <Flex align="center" justify="space-between">
                <span>
                  <strong>Microphone:</strong> Records your voice only
                </span>
                <FaMicrophone color="#f56565" />
              </Flex>
              {canRecordSystemAudio && (
                <Flex align="center" justify="space-between">
                  <span>
                    <strong>System Audio:</strong> Records meeting participants
                    and system sounds
                  </span>
                  <FaDesktop color="#4299e1" />
                </Flex>
              )}
              {canRecordSystemAudio && (
                <Flex align="center" justify="space-between">
                  <span>
                    <strong>Both:</strong> Records your voice + meeting
                    participants (recommended for online meetings)
                  </span>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FaMicrophone color="#9f7aea" />
                    <FaDesktop color="#9f7aea" />
                  </Box>
                </Flex>
              )}
              {!canRecordSystemAudio && (
                <Flex align="center" color="amber.600" mt={2}>
                  <FaExclamationTriangle style={{ marginRight: 4 }} />
                  System audio recording not supported in this browser
                  {showSystemAudioHelp && (
                    <Button
                      variant="link"
                      size="xs"
                      color="blue.500"
                      ml={2}
                      onClick={showSystemAudioHelp}
                    >
                      Help
                    </Button>
                  )}
                </Flex>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default UploadView;

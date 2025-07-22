import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

interface AudioPlayerProps {
  audio_path: string;
  duration?: number;
  file_size?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio_path,
  duration,
  file_size,
}) => (
  <Box
    bg="var(--input-bg-light)"
    _dark={{ bg: 'var(--input-bg-dark)', borderColor: '#444' }}
    p={2}
    borderBottom="1px solid"
    borderColor="#eee"
  >
    <Flex
      mt={2}
      gap={4}
      color="var(--text-color-light)"
      _dark={{ color: 'var(--text-color-dark)' }}
      fontSize="sm"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box flex="1">
        <audio controls src={audio_path || ''} style={{ width: '100%' }}>
          <track kind="captions" src="" label="No captions" default />
        </audio>
      </Box>
      <Box flex={1}>
        <Flex alignItems="center" justifyContent="space-around">
          {duration !== undefined && (
            <Box>
              <strong>Duration:</strong> {duration}s
            </Box>
          )}
          {file_size !== undefined && (
            <Box>
              <strong>Size:</strong> {file_size} bytes
            </Box>
          )}
        </Flex>
      </Box>
    </Flex>
  </Box>
);

export default AudioPlayer;

import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import ParseTranscriptToHtml from './ParseTranscriptToHtml';

interface TranscriptPanelProps {
  transcript: any;
  textColor: string;
  borderColor: string;
  handleCopyTranscript: () => void;
  copySuccess: string | null;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcript,
  textColor,
  borderColor,
  copySuccess,
}) => {
  return (
    <Box height={'100%'}>
      {copySuccess && (
        <Text
          fontSize="sm"
          color={copySuccess === 'Copied!' ? 'green.500' : 'red.500'}
          ml={2}
        >
          {copySuccess}
        </Text>
      )}
      <Box mt={2}>
        {Array.isArray(transcript) ? (
          <ParseTranscriptToHtml
            transcriptArr={transcript}
            textColor={textColor}
            borderColor={borderColor}
          />
        ) : typeof transcript === 'string' ? (
          (() => {
            let arr = null;
            let cleaned = transcript
              .replace(/\n/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            if (!cleaned.startsWith('[')) cleaned = '[' + cleaned;
            if (!cleaned.endsWith(']')) cleaned = cleaned + ']';
            cleaned = cleaned.replace(/'/g, '"');
            try {
              arr = JSON.parse(cleaned);
            } catch {
              arr = null;
            }
            if (Array.isArray(arr)) {
              return (
                <ParseTranscriptToHtml
                  transcriptArr={arr}
                  textColor={textColor}
                  borderColor={borderColor}
                />
              );
            }
            return (
              <Text color="var(--text-color-light)">
                No transcription available.
              </Text>
            );
          })()
        ) : (
          <Text color="var(--text-color-light)">
            No transcription available.
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default TranscriptPanel;

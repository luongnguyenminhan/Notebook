import React, { RefObject } from 'react';
import { Box, Flex, Text, Textarea, Button } from '@chakra-ui/react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

interface ChatPanelProps {
  chatMessages: any[];
  chatInput: string;
  setChatInput: (v: string) => void;
  handleSendChat: () => void;
  isWaitingBot: boolean;
  chatEndRef: RefObject<HTMLDivElement>;
  chatBg: string;
  chatPanelBorder: string;
  chatText: string;
  chatUserBg: string;
  chatUserColor: string;
  chatBotBg: string;
  chatBotColor: string;
  chatInputBg: string;
  chatInputBorder: string;
  chatInputColor: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendChat,
  isWaitingBot,
  chatEndRef,
  chatBg,
  chatPanelBorder,
  chatText,
  chatUserBg,
  chatUserColor,
  chatBotBg,
  chatBotColor,
  chatInputBg,
  chatInputBorder,
  chatInputColor,
}) => (
  <Flex
    direction="column"
    h="60vh"
    bg={chatBg}
    borderRadius="xl"
    boxShadow="sm"
    overflow="hidden"
    borderWidth="1px"
    borderColor={chatPanelBorder}
  >
    <Box flex="1" overflowY="auto" p={4} bg={chatBg}>
      {chatMessages.length === 0 ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          color={chatText}
        >
          <FaRobot size={32} />
          <Text mt={2}>Ask questions about this transcription</Text>
        </Flex>
      ) : (
        <>
          {chatMessages.map((msg, idx) => (
            <Flex
              key={idx}
              justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Box
                mb={3}
                p={2}
                bg={msg.role === 'user' ? chatUserBg : chatBotBg}
                color={msg.role === 'user' ? chatUserColor : chatBotColor}
                borderRadius="lg"
                maxW="80%"
                textAlign={msg.role === 'user' ? 'right' : 'left'}
                fontSize="md"
                boxShadow="xs"
              >
                {msg.content}
              </Box>
            </Flex>
          ))}
          <div ref={chatEndRef} />
        </>
      )}
    </Box>
    <Flex p={4} gap={2} borderTop="1px solid" borderColor={chatPanelBorder}>
      <Textarea
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        placeholder="Ask about this transcription..."
        flex="1"
        rows={1}
        resize="none"
        borderRadius="xl"
        bg={chatInputBg}
        color={chatInputColor}
        borderColor={chatInputBorder}
        _focus={{ borderColor: '#0070f3', bg: chatInputBg }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendChat();
          }
        }}
      />
      <Button
        onClick={handleSendChat}
        leftIcon={<FaPaperPlane />}
        bg="#0070f3"
        color="white"
        borderRadius="xl"
        _hover={{ bg: '#339dff' }}
        disabled={isWaitingBot}
      >
        Send
      </Button>
    </Flex>
  </Flex>
);

export default ChatPanel;

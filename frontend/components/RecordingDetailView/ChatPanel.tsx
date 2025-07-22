/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-unused-vars */
import React, { RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
                {msg.role === 'bot' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: (props: any) => {
                        const { inline, className, children, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');
                        const codeContent = String(children).replace(/\n$/, '');
                        const language = match ? match[1] : 'text';
                        if (inline) {
                          return (
                            <code
                              style={{
                                background: chatBotBg,
                                color: chatBotColor,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.95em',
                                fontFamily: 'monospace',
                                border: `1px solid ${chatPanelBorder}`,
                              }}
                              {...rest}
                            >
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre
                            style={{
                              background: chatBotBg,
                              color: chatBotColor,
                              padding: '12px',
                              borderRadius: '8px',
                              fontSize: '0.98em',
                              fontFamily: 'monospace',
                              border: `1px solid ${chatPanelBorder}`,
                              overflowX: 'auto',
                            }}
                          >
                            <code>{codeContent}</code>
                          </pre>
                        );
                      },
                      h1: (props: any) => (
                        <h1
                          style={{
                            fontSize: '1.5em',
                            fontWeight: 700,
                            marginBottom: 12,
                            color: chatBotColor,
                          }}
                          {...props}
                        />
                      ),
                      h2: (props: any) => (
                        <h2
                          style={{
                            fontSize: '1.2em',
                            fontWeight: 600,
                            marginBottom: 10,
                            color: chatBotColor,
                          }}
                          {...props}
                        />
                      ),
                      h3: (props: any) => (
                        <h3
                          style={{
                            fontSize: '1em',
                            fontWeight: 500,
                            marginBottom: 8,
                            color: chatBotColor,
                          }}
                          {...props}
                        />
                      ),
                      ul: (props: any) => (
                        <ul
                          style={{
                            marginLeft: 20,
                            marginBottom: 8,
                            color: chatBotColor,
                          }}
                          {...props}
                        />
                      ),
                      ol: (props: any) => (
                        <ol
                          style={{
                            marginLeft: 20,
                            marginBottom: 8,
                            color: chatBotColor,
                          }}
                          {...props}
                        />
                      ),
                      li: (props: any) => (
                        <li
                          style={{ marginBottom: 4, color: chatBotColor }}
                          {...props}
                        />
                      ),
                      p: (props: any) => (
                        <p
                          style={{ marginBottom: 8, color: chatBotColor }}
                          {...props}
                        />
                      ),
                      a: (props: any) => (
                        <a
                          href={props.href}
                          style={{
                            color: chatUserBg,
                            textDecoration: 'underline',
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        >
                          {props.children}
                        </a>
                      ),
                      strong: (props: any) => (
                        <strong
                          style={{ fontWeight: 600, color: chatBotColor }}
                          {...props}
                        />
                      ),
                      em: (props: any) => (
                        <em
                          style={{ fontStyle: 'italic', color: chatBotColor }}
                          {...props}
                        />
                      ),
                      blockquote: (props: any) => (
                        <blockquote
                          style={{
                            borderLeft: `4px solid ${chatUserBg}`,
                            background: chatBotBg,
                            padding: '8px 16px',
                            borderRadius: '6px',
                            marginBottom: 8,
                            color: chatBotColor,
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
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

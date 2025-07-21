/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import {
  FaDesktop,
  FaTimes,
  FaExclamationTriangle,
  FaChrome,
  FaFirefoxBrowser,
} from 'react-icons/fa';

interface SystemAudioHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  browser?: 'chrome' | 'firefox' | 'other';
}

const SystemAudioHelpModal: React.FC<SystemAudioHelpModalProps> = ({
  isOpen,
  onClose,
  browser = 'other',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
    <ModalOverlay />
    <ModalContent maxH="90vh">
      <ModalHeader borderBottomWidth={1} borderColor="var(--border-primary)">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <FaDesktop className="text-blue-500" />
            <Text fontWeight="bold">System Audio Recording</Text>
          </Flex>
          <IconButton
            aria-label="close"
            icon={<FaTimes />}
            variant="ghost"
            color="var(--text-muted)"
            onClick={onClose}
            _hover={{ color: 'var(--text-primary)' }}
          />
        </Flex>
      </ModalHeader>
      <ModalBody p={6} overflowY="auto">
        <Box
          bg="var(--bg-tertiary)"
          p={4}
          borderRadius="lg"
          borderWidth={1}
          borderColor="var(--border-primary)"
          mb={6}
        >
          <Text fontWeight="medium" color="var(--text-primary)" mb={2}>
            How to Record System Audio
          </Text>
          <Text fontSize="sm" color="var(--text-muted)">
            To capture audio from meetings or other apps, you must share your
            screen or a browser tab.
          </Text>
          <Box
            as="ol"
            pl={5}
            mt={3}
            color="var(--text-secondary)"
            fontSize="sm"
          >
            <li>
              Click &quot;Record System Audio&quot; or &quot;Record Both&quot;.
            </li>
            <li>
              In the popup, choose <b>&quot;Entire Screen&quot;</b> or a{' '}
              <b>specific browser tab</b>.
            </li>
            <li>
              Make sure to check the box that says{' '}
              <b>&quot;Share tab audio&quot;</b> or{' '}
              <b>&quot;Share system audio&quot;</b>.
            </li>
          </Box>
          <Text fontSize="xs" color="amber.600" mt={3}>
            <FaExclamationTriangle
              style={{ marginRight: 4, display: 'inline' }}
            />
            Sharing a "Window" will not capture audio.
          </Text>
        </Box>
        <Box>
          <Text fontWeight="medium" color="var(--text-primary)" mb={2}>
            Troubleshooting
          </Text>
          <Box
            bg="var(--bg-tertiary)"
            p={4}
            borderRadius="lg"
            borderWidth={1}
            borderColor="var(--border-primary)"
            mb={4}
          >
            <Text fontWeight="medium" color="var(--text-primary)" mb={2}>
              Why isn't it working?
            </Text>
            <Text fontSize="sm" color="var(--text-muted)">
              System audio recording requires a secure (HTTPS) connection. If
              you are developing locally, you may need to enable a browser flag.
            </Text>
          </Box>
          {browser === 'chrome' && (
            <Box
              bg="var(--bg-accent)"
              p={4}
              borderRadius="lg"
              borderWidth={1}
              borderColor="var(--border-accent)"
              mb={4}
            >
              <Flex align="center" gap={2} mb={3}>
                <FaChrome />
                <Text fontWeight="medium" color="var(--text-accent)">
                  For Chrome on Localhost
                </Text>
              </Flex>
              <Box as="ol" pl={5} color="var(--text-secondary)" fontSize="sm">
                <li>
                  Go to:{' '}
                  <code className="bg-[var(--bg-secondary)] px-2 py-1 rounded text-xs ml-1">
                    chrome://flags/#unsafely-treat-insecure-origin-as-secure
                  </code>
                </li>
                <li>
                  Add your local URL (e.g.,{' '}
                  <code className="bg-[var(--bg-secondary)] px-2 py-1 rounded text-xs ml-1">
                    http://localhost:8899
                  </code>
                  )
                </li>
                <li>
                  Set to <b>"Enabled"</b> and relaunch Chrome.
                </li>
              </Box>
            </Box>
          )}
          {browser === 'firefox' && (
            <Box
              bg="var(--bg-accent)"
              p={4}
              borderRadius="lg"
              borderWidth={1}
              borderColor="var(--border-accent)"
              mb={4}
            >
              <Flex align="center" gap={2} mb={3}>
                <FaFirefoxBrowser />
                <Text fontWeight="medium" color="var(--text-accent)">
                  For Firefox on Localhost
                </Text>
              </Flex>
              <Text fontSize="sm" color="var(--text-secondary)">
                System audio recording is not well-supported on Firefox, even
                with these changes. For best results, please use Chrome.
              </Text>
              <Box
                as="ol"
                pl={5}
                color="var(--text-secondary)"
                fontSize="sm"
                mt={2}
              >
                <li>
                  Go to:{' '}
                  <code className="bg-[var(--bg-secondary)] px-2 py-1 rounded text-xs ml-1">
                    about:config
                  </code>
                </li>
                <li>
                  Search for{' '}
                  <code className="bg-[var(--bg-secondary)] px-2 py-1 rounded text-xs ml-1">
                    media.devices.insecure.enabled
                  </code>{' '}
                  and set it to `true`.
                </li>
                <li>Restart Firefox.</li>
              </Box>
            </Box>
          )}
          {browser === 'other' && (
            <Box
              bg="var(--bg-tertiary)"
              p={4}
              borderRadius="lg"
              borderWidth={1}
              borderColor="var(--border-primary)"
            >
              <Text fontWeight="medium" color="var(--text-primary)" mb={2}>
                Unsupported Browser
              </Text>
              <Text fontSize="sm" color="var(--text-muted)">
                For the best experience with system audio recording, we
                recommend using Google Chrome.
              </Text>
            </Box>
          )}
        </Box>
      </ModalBody>
      <ModalFooter borderTopWidth={1} borderColor="var(--border-primary)">
        <Button
          onClick={onClose}
          bg="var(--bg-button)"
          color="var(--text-button)"
          _hover={{ bg: 'var(--bg-button-hover)' }}
        >
          Got it
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SystemAudioHelpModal;

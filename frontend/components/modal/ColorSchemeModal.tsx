import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Box, Text, Flex, Grid } from '@chakra-ui/react';
import { FaPalette, FaSun, FaMoon, FaCheck, FaUndo } from 'react-icons/fa';

interface ColorScheme {
  id: string;
  name: string;
  description: string;
}

interface ColorSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  onReset: () => void;
  colorSchemes: { light: ColorScheme[]; dark: ColorScheme[] };
  currentColorScheme: string;
  isDarkMode: boolean;
}

const ColorSchemeModal: React.FC<ColorSchemeModalProps> = ({ isOpen, onClose, onSelect, onReset, colorSchemes, currentColorScheme, isDarkMode }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
    <ModalOverlay />
    <ModalContent className="color-scheme-modal-content">
      <ModalHeader>
        <Flex align="center" gap={2}><FaPalette /> Choose Color Scheme</Flex>
        <Text fontSize="sm" color="var(--text-muted)">Customize your interface with beautiful color themes</Text>
      </ModalHeader>
      <ModalBody>
        <Box mb={4}>
          <Flex align="center" gap={2} fontWeight="semibold">
            {isDarkMode ? <FaMoon /> : <FaSun />}
            {isDarkMode ? 'Dark' : 'Light'} Themes
          </Flex>
        </Box>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
          {(isDarkMode ? colorSchemes.dark : colorSchemes.light).map(scheme => (
            <Box key={scheme.id} onClick={() => onSelect(scheme.id)} cursor="pointer" borderWidth={2} borderColor={currentColorScheme === scheme.id ? 'blue.500' : 'transparent'} borderRadius="lg" p={4} className={currentColorScheme === scheme.id ? 'active' : ''}>
              <Flex align="center" gap={2} mb={2}>
                <Box className={`preview-${isDarkMode ? 'dark-' : ''}${scheme.id}-primary color-scheme-preview-segment`} w={6} h={3} borderRadius="md" />
                <Box className={`preview-${isDarkMode ? 'dark-' : ''}${scheme.id}-secondary color-scheme-preview-segment`} w={6} h={3} borderRadius="md" />
                <Box className={`preview-${isDarkMode ? 'dark-' : ''}${scheme.id}-tertiary color-scheme-preview-segment`} w={6} h={3} borderRadius="md" />
                <Text fontWeight="bold">{scheme.name}</Text>
                {currentColorScheme === scheme.id && <FaCheck color="blue.500" />}
              </Flex>
              <Text fontSize="sm" color="var(--text-muted)">{scheme.description}</Text>
            </Box>
          ))}
        </Grid>
      </ModalBody>
      <ModalFooter>
        <Button leftIcon={<FaUndo />} variant="ghost" onClick={onReset} mr={3}>Reset to Default</Button>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ColorSchemeModal; 
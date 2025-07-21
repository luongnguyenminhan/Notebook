import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Box, Text, Flex, Input, Checkbox, Spinner } from '@chakra-ui/react';
import { FaTimes, FaTrash } from 'react-icons/fa';

interface SharesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userShares: any[];
  onDeleteShare: (id: string) => void;
  onUpdateShare: (share: any) => void;
  loading?: boolean;
}

const SharesListModal: React.FC<SharesListModalProps> = ({ isOpen, onClose, userShares, onDeleteShare, onUpdateShare, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
    <ModalOverlay />
    <ModalContent borderRadius="lg" maxH="80vh" display="flex" flexDirection="column">
      <ModalHeader borderBottomWidth={1} borderColor="var(--border-primary)">
        My Shared Transcripts
        <Button onClick={onClose} size="sm" variant="ghost" float="right"><FaTimes /></Button>
      </ModalHeader>
      <ModalBody p={6} overflowY="auto">
        {loading ? (
          <Flex justify="center" align="center" py={8}><Spinner size="lg" /></Flex>
        ) : userShares.length === 0 ? (
          <Text color="var(--text-muted)">You haven't shared any transcripts yet.</Text>
        ) : (
          userShares.map(share => (
            <Box key={share.id} bg="var(--bg-tertiary)" p={4} borderRadius="lg" borderWidth={1} borderColor="var(--border-primary)" mb={4}>
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontWeight="semibold">{share.recording_title}</Text>
                  <Text fontSize="sm" color="var(--text-muted)">Shared on: {share.created_at}</Text>
                </Box>
                <IconButton aria-label="delete" icon={<FaTrash />} colorScheme="red" variant="ghost" onClick={() => onDeleteShare(share.id)} />
              </Flex>
              <Flex mt={4} gap={4} align="center">
                <Checkbox isChecked={share.share_summary} onChange={e => onUpdateShare({ ...share, share_summary: e.target.checked })} colorScheme="blue">Share Summary</Checkbox>
                <Checkbox isChecked={share.share_notes} onChange={e => onUpdateShare({ ...share, share_notes: e.target.checked })} colorScheme="blue">Share Notes</Checkbox>
              </Flex>
              <Box mt={4}>
                <Input value={share.public_link} readOnly bg="var(--bg-input)" borderColor="var(--border-secondary)" fontSize="sm" />
              </Box>
            </Box>
          ))
        )}
      </ModalBody>
      <ModalFooter borderTopWidth={1} borderColor="var(--border-primary)">
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default SharesListModal; 
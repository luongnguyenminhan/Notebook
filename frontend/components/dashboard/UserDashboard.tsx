import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import UserHeader from './UserHeader';
import Sidebar from '../Sidebar';
import RecordingDetailView from '../RecordingDetailView';
import UploadModal from './UploadModal';
import ColorSchemeModal from '../modal/ColorSchemeModal';
import ConfirmDeleteRecordingModal from '../modal/ConfirmDeleteRecordingModal';
import ReprocessModal from '../modal/ReprocessModal';
import ResetStatusModal from '../modal/ResetStatusModal';
import SystemAudioHelpModal from '../modal/SystemAudioHelpModal';
import GlobalErrorToast from '../GlobalErrorToast';
import UploadProgressPopup from '../UploadProgressPopup';
import EmptyStateView from '../EmptyStateView';

const mockUser = {
  username: 'nguyenvanA',
  email: 'nguyenvana@email.com',
  avatar: '/favicon.svg',
};
const mockRecordings = [
  {
    id: 1,
    title: 'Cuộc họp 1',
    status: 'COMPLETED',
    participants: 'A, B',
    created_at: '2024-06-01',
    meeting_date: '2024-06-01',
    is_highlighted: true,
    is_inbox: false,
  },
  {
    id: 2,
    title: 'Cuộc họp 2',
    status: 'PROCESSING',
    participants: 'A, C',
    created_at: '2024-06-02',
    meeting_date: '2024-06-02',
    is_highlighted: false,
    is_inbox: true,
  },
];

const UserDashboard = () => {
  // State quản lý
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showColorScheme, setShowColorScheme] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReprocessModal, setShowReprocessModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSharesListModal, setShowSharesListModal] = useState(false);
  const [showSystemAudioHelp, setShowSystemAudioHelp] = useState(false);
  const [error, setError] = useState(null);

  // Callback ví dụ
  const handleDelete = () => {
    setShowDeleteModal(false);
  };
  const handleReset = () => {
    setShowResetModal(false);
  };

  return (
    <Flex
      h="80vh"
      w="100%"
      direction="column"
      bg="var(--input-bg-light)"
      _dark={{ bg: 'var(--input-bg-dark)' }}
    >
      <UserHeader user={mockUser} onUpload={() => setShowUpload(true)} />
      <Flex flex="1">
        <Sidebar
          recordings={mockRecordings}
          loading={false}
          onUpload={() => setShowUpload(true)}
          onSelect={(rec: any) => setSelectedRecording(rec)}
          selectedId={selectedRecording?.id}
        />
        <Box flex="1" p={4} minW={0}>
          {selectedRecording ? (
            <RecordingDetailView selectedRecording={selectedRecording} />
          ) : (
            <EmptyStateView onUpload={() => setShowUpload(true)} />
          )}
        </Box>
      </Flex>
      {/* Modal & popup */}
      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
      <ColorSchemeModal
        isOpen={showColorScheme}
        onClose={() => setShowColorScheme(false)}
        colorSchemes={{ light: [], dark: [] }}
        currentColorScheme="default"
        isDarkMode={false}
        onSelect={() => {}}
        onReset={() => {}}
      />
      <ConfirmDeleteRecordingModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDelete}
      />
      <ReprocessModal
        isOpen={showReprocessModal}
        onClose={() => setShowReprocessModal(false)}
        onReprocess={() => {}}
        reprocessType="transcription"
      />
      <ResetStatusModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={handleReset}
      />
      <SystemAudioHelpModal
        isOpen={showSystemAudioHelp}
        onClose={() => setShowSystemAudioHelp(false)}
      />
      <GlobalErrorToast error={error} onClose={() => setError(null)} />
      <UploadProgressPopup
        uploadQueue={[]}
        progressPopupClosed={false}
        progressPopupMinimized={false}
        onClose={() => {}}
        onMinimize={() => {}}
        finishedFilesInQueue={[]}
        completedInQueue={0}
        totalInQueue={0}
      />
    </Flex>
  );
};

export default UserDashboard;

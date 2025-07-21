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

import { useEffect } from 'react';
import { getAllRecordings } from '@/services/api/recording';
import { getMe } from '@/services/api/auth';

const UserDashboard = () => {
  // State quản lý
  const [user, setUser] = useState<any>(null);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showColorScheme, setShowColorScheme] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReprocessModal, setShowReprocessModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSystemAudioHelp, setShowSystemAudioHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user info and recordings from API
  useEffect(() => {
    const fetchUserAndRecordings = async () => {
      try {
        // You may want to get token from localStorage or context
        const token = localStorage.getItem('access_token');
        if (token) {
          const userData = await getMe(token);
          setUser(userData);
        }
        const data = await getAllRecordings();
        setRecordings(data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch user or recordings');
      }
    };
    fetchUserAndRecordings();
  }, []);

  // Callback ví dụ
  const handleDelete = () => {
    setShowDeleteModal(false);
  };
  const handleReset = () => {
    setShowResetModal(false);
  };

  // Handle upload and refresh recordings
  const handleUploaded = async () => {
    setShowUpload(false);
    try {
      const data = await getAllRecordings();
      setRecordings(data);
    } catch {
      setError('Failed to refresh recordings');
    }
  };

  return (
    <Flex
      h="80vh"
      w="100%"
      direction="column"
      bg="var(--input-bg-light)"
      _dark={{ bg: 'var(--input-bg-dark)' }}
    >
      <UserHeader user={user} onUpload={() => setShowUpload(true)} />
      <Flex flex="1">
        <Sidebar
          recordings={recordings}
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
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleUploaded}
      />
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

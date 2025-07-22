import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { FaMicrophone, FaPlus } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface EmptyStateViewProps {
  onUpload: () => void;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onUpload }) => {
  const t = useTranslations('EmptyState');
  return (
    <Flex flex="1" align="center" justify="center" bg="#fff" minH="100vh">
      <Box
        textAlign="center"
        p={8}
        borderRadius="2xl"
        boxShadow="0 4px 24px 0 rgba(0,0,0,0.07)"
        maxW="400px"
        mx="auto"
        bg="#fff"
      >
        <Box
          as={FaMicrophone}
          fontSize="6xl"
          color="#bdbdbd"
          mb={4}
          mx="auto"
        />
        <Text fontSize="2xl" fontWeight="bold" mb={2} color="#1a202c">
          {t('selectTitle')}
        </Text>
        <Text color="#888" mb={6} fontSize="md">
          {t('selectDescription')}
        </Text>
        <Button
          leftIcon={<FaPlus style={{ marginRight: 8 }} />}
          px={6}
          py={3}
          bg="#0070f3"
          color="#fff"
          rounded="xl"
          fontWeight={600}
          fontSize="md"
          boxShadow="0 2px 8px 0 rgba(0,112,243,0.10)"
          _hover={{ bg: '#339dff', filter: 'brightness(1.08)' }}
          _active={{ bg: '#0070f3' }}
          transition="all 0.2s"
          onClick={onUpload}
        >
          {t('uploadButton')}
        </Button>
      </Box>
    </Flex>
  );
};

export default EmptyStateView;

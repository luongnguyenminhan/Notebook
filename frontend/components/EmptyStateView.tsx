import React from 'react';
import { Box, Flex, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { FaMicrophone, FaPlus } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface EmptyStateViewProps {
  onUpload: () => void;
}

const EmptyStateView: React.FC<EmptyStateViewProps> = ({ onUpload }) => {
  const t = useTranslations('EmptyState');
  const bg = useColorModeValue('white', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'gray.100');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const iconColor = useColorModeValue('gray.300', 'gray.600');
  const btnBg = useColorModeValue('#0070f3', 'blue.400');
  const btnHover = useColorModeValue('#339dff', 'blue.500');
  const btnActive = useColorModeValue('#0070f3', 'blue.600');

  return (
    <Flex flex="1" align="center" justify="center" bg={bg} minH="100vh">
      <Box
        textAlign="center"
        p={8}
        borderRadius="2xl"
        boxShadow="0 4px 24px 0 rgba(0,0,0,0.07)"
        maxW="400px"
        mx="auto"
        bg={boxBg}
      >
        <Box
          as={FaMicrophone}
          fontSize="6xl"
          color={iconColor}
          mb={4}
          mx="auto"
        />
        <Text fontSize="2xl" fontWeight="bold" mb={2} color={textColor}>
          {t('selectTitle')}
        </Text>
        <Text color={subTextColor} mb={6} fontSize="md">
          {t('selectDescription')}
        </Text>
        <Button
          leftIcon={<FaPlus style={{ marginRight: 8 }} />}
          px={6}
          py={3}
          bg={btnBg}
          color="white"
          rounded="xl"
          fontWeight={600}
          fontSize="md"
          boxShadow="0 2px 8px 0 rgba(0,112,243,0.10)"
          _hover={{ bg: btnHover, filter: 'brightness(1.08)' }}
          _active={{ bg: btnActive }}
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

import React from 'react';
import {
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
} from '@chakra-ui/react';

interface StatusCardProps {
  label: string;
  value: number;
  total: number;
  color?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  label,
  value,
  total,
  color = 'blue.500',
}) => {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return (
    <Box
      p={4}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      _dark={{ bg: 'gray.800' }}
      minW="180px"
      textAlign="center"
    >
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber color={color}>{value}</StatNumber>
      </Stat>
      <Progress
        value={percent}
        colorScheme={getColorScheme(color)}
        size="sm"
        borderRadius="md"
        mt={2}
      />
      <Text fontSize="sm" color="gray.500" mt={1}>
        {percent}%
      </Text>
    </Box>
  );
};

function getColorScheme(color: string) {
  if (color.includes('green')) return 'green';
  if (color.includes('yellow')) return 'yellow';
  if (color.includes('blue')) return 'blue';
  if (color.includes('red')) return 'red';
  if (color.includes('purple')) return 'purple';
  if (color.includes('orange')) return 'orange';
  return 'gray';
}

export default StatusCard;

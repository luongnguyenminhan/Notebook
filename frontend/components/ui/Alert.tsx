import {
  Alert as ChakraAlert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import React from 'react';

interface AlertProps {
  status?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  description?: string;
}

export function Alert({ status = 'info', title, description }: AlertProps) {
  return (
    <ChakraAlert status={status}>
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </ChakraAlert>
  );
}

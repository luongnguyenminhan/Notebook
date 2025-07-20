import React from 'react';
import NextLink from 'next/link';
import { Button as ChakraButton, useColorModeValue } from '@chakra-ui/react';

interface ButtonProps {
  href?: string;
  variant?: 'solid' | 'outline';
  solidBg?: string;
  solidHoverBg?: string;
  solidTextColor?: string;
  outlineBorderColor?: string;
  outlineHoverBg?: string;
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

const Button: React.FC<ButtonProps> = ({
  href,
  variant = 'solid',
  solidBg,
  solidHoverBg,
  solidTextColor,
  outlineBorderColor,
  outlineHoverBg,
  children,
  onClick,
  style,
  leftIcon,
  rightIcon,
}) => {
  // Default colors with dark mode support
  const defaultSolidBg = useColorModeValue('#2563eb', '#60A5FA');
  const defaultSolidHoverBg = useColorModeValue('blue.500', 'blue.300');
  const defaultSolidTextColor = useColorModeValue('white', 'gray.900');
  const defaultOutlineBorderColor = useColorModeValue(
    'gray.200',
    'whiteAlpha.300',
  );
  const defaultOutlineHoverBg = useColorModeValue('gray.50', 'whiteAlpha.200');

  const buttonStyles = {
    rounded: 'full',
    px: 6,
    py: 3,
    fontSize: 'lg',
    fontWeight: 'semibold',
    leftIcon: leftIcon,
    rightIcon: rightIcon,
    ...(variant === 'solid'
      ? {
          bg: solidBg || defaultSolidBg,
          color: solidTextColor || defaultSolidTextColor,
          _hover: { bg: solidHoverBg || defaultSolidHoverBg },
        }
      : {
          variant: 'outline',
          borderColor: outlineBorderColor || defaultOutlineBorderColor,
          _hover: { bg: outlineHoverBg || defaultOutlineHoverBg },
        }),
    style,
  };

  if (href) {
    return (
      <ChakraButton as={NextLink} href={href} {...buttonStyles}>
        {children}
      </ChakraButton>
    );
  }

  return (
    <ChakraButton onClick={onClick} {...buttonStyles}>
      {children}
    </ChakraButton>
  );
};

export default Button;

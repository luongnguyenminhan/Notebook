import NextLink from 'next/link';
import {
  Box,
  Container,
  Flex,
  Text,
  Link,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const iconHoverColor = useColorModeValue('gray.700', 'gray.200');
  const t = useTranslations('Footer');

  return (
    <Box as="footer" bg={bgColor}>
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', sm: 'row-reverse' }}
          justify="space-between"
          align="center"
          py={10}
          borderTop="1px"
          borderColor={borderColor}
        >
          <Flex gap={6}>
            <Link
              as={NextLink}
              href="https://github.com/aelabid/Next-StarterKit"
              aria-label="Next StarterKit on GitHub"
              _hover={{ opacity: 0.8 }}
            >
              <Icon
                viewBox="0 0 24 24"
                boxSize={6}
                color={iconColor}
                _hover={{ color: iconHoverColor }}
                transition="color 0.2s"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
                />
              </Icon>
            </Link>
          </Flex>
          <Text fontSize="sm" color={textColor} mt={{ base: 6, sm: 0 }}>
            {t('copyright', { year: new Date().getFullYear() })}
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

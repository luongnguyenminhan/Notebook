'use client';

import React from 'react';
import { Box, Text, Link, useColorModeValue } from '@chakra-ui/react';

const FooterSection = ({ id }: { id: string }) => (
  <Box
    as="footer"
    id={id}
    className="footer-section"
    bg={useColorModeValue('gray.50', 'gray.800')}
    py={4}
    px={5}
    textAlign="center"
  >
    <Text mb={2}>
      &copy; {new Date().getFullYear()} NextJs StarterKit . All rights reserved.
    </Text>
    <Text>
      <Link
        href="https://github.com/aelabid/Next-StarterKit"
        target="_blank"
        rel="noopener noreferrer"
        color={useColorModeValue('teal.500', 'teal.200')}
      >
        GitHub
      </Link>
      {' | '}
      <Link href="/privacy" color={useColorModeValue('teal.500', 'teal.200')}>
        Privacy
      </Link>
      {' | '}
      <Link href="/terms" color={useColorModeValue('teal.500', 'teal.200')}>
        Terms
      </Link>
    </Text>
  </Box>
);

export default FooterSection;

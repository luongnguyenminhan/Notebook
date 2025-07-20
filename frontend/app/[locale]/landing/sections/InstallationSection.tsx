'use client';

import React from 'react';
import { Box, Heading, useColorModeValue, Code } from '@chakra-ui/react';

const InstallationSection = ({ id }: { id: string }) => (
  <Box
    id={id}
    className="installation-section"
    bg={useColorModeValue('gray.50', 'gray.800')}
    py={10}
    px={5}
    textAlign="center"
  >
    <Heading as="h2" size="xl" mb={4}>
      Get Started
    </Heading>
    <Code
      display="block"
      whiteSpace="pre"
      p={4}
      bg={useColorModeValue('gray.100', 'gray.700')}
      borderRadius="md"
    >
      git clone https://github.com/your-repo.git
      <br />
      cd your-repo
      <br />
      npm install
      <br />
      npm run dev
    </Code>
  </Box>
);

export default InstallationSection;

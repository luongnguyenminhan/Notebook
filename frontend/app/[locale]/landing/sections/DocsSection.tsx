'use client';

import React from 'react';
import { Box, Heading, Text, Link, useColorModeValue } from '@chakra-ui/react';

const DocsSection = ({ id }: { id: string }) => (
  <Box
    id={id}
    className="docs-section"
    bg={useColorModeValue('gray.50', 'gray.800')}
    py={10}
    px={5}
    textAlign="center"
  >
    <Heading as="h2" size="xl" mb={4}>
      Documentation & CI/CD
    </Heading>
    <Text fontSize="lg" mb={6}>
      Learn how to use this starter and set up CI/CD pipelines for seamless
      deployments.
    </Text>
    <Link
      href="https://github.com/aelabid/Next-StarterKit"
      target="_blank"
      rel="noopener noreferrer"
      color={useColorModeValue('teal.500', 'teal.200')}
    >
      Read Documentation
    </Link>
  </Box>
);

export default DocsSection;

'use client';
import React from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const TestimonialsSection = ({ id }: { id: string }) => (
  <Box
    id={id}
    className="testimonials-section"
    bg={useColorModeValue('gray.50', 'gray.800')}
    py={10}
    px={5}
    textAlign="center"
  >
    <Heading as="h2" size="xl" mb={4}>
      What Users Are Saying
    </Heading>
    <Text fontSize="lg" mb={6}>
      See feedback from developers who use this starter:
    </Text>
    {/* Placeholder for testimonials */}
  </Box>
);

export default TestimonialsSection;

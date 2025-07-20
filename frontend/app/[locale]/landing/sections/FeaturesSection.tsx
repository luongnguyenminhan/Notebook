'use client';

import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import DevStackIcon from '@/public/images/icons/DevStackIcon';
import StateManagementIcon from '@/public/images/icons/StateManagementIcon';
import I18nIcon from '@/public/images/icons/I18nIcon';
import CICDIcon from '@/public/images/icons/CICDIcon';
import DevEnvIcon from '@/public/images/icons/DevEnvIcon';
import { useTranslations } from 'next-intl';

// interface Feature {
//   name: string;
//   summary: string;
//   description: string;
//   icon: React.ComponentType;
// }

const features = [
  {
    key: 'openSource',
    icon: function OpenSourceIcon() {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={useColorModeValue('#2563eb', '#60A5FA')}
          className="size-8"
        >
          <path
            fillRule="evenodd"
            d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
            clipRule="evenodd"
          />
        </svg>
      );
    },
  },
  { key: 'devStack', icon: DevStackIcon },
  { key: 'stateManagement', icon: StateManagementIcon },
  { key: 'i18n', icon: I18nIcon },
  { key: 'cicd', icon: CICDIcon },
  { key: 'devEnv', icon: DevEnvIcon },
];

const SwirlyDoodle = (props: any) => (
  <Icon
    aria-hidden="true"
    viewBox="0 0 418 42"
    preserveAspectRatio="none"
    {...props}
  >
    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
  </Icon>
);

const FeatureCard = ({
  featureKey,
  icon: IconComponent,
}: {
  featureKey: string;
  icon: React.ComponentType;
}) => {
  const t = useTranslations('HomePage.features.items');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const iconColor = useColorModeValue('#2563eb', '#60A5FA');

  // const IconComponent = feature.icon;

  return (
    <Box
      as="button"
      w="full"
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      rounded="lg"
      p={6}
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
        borderColor: 'blue.400',
        transform: 'translateY(-2px)',
      }}
      textAlign="left" // Add this to ensure text alignment
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box
        w="9"
        h="9"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
      >
        <Box as={IconComponent} w={6} h={6} color={iconColor} />
      </Box>
      <Text
        mt={6}
        fontSize="sm"
        fontWeight="medium"
        color={useColorModeValue('gray.900', 'white')}
      >
        {t(`${featureKey}.name`)}
      </Text>

      <Box my={3} w="8" borderTopWidth="1px" borderColor={iconColor} />

      <Text
        mt={2}
        fontSize="xl"
        fontFamily="heading"
        color={useColorModeValue('gray.600', 'gray.300')}
      >
        {t(`${featureKey}.summary`)}
      </Text>

      <Text
        mt={4}
        fontSize="sm"
        color={useColorModeValue('gray.500', 'gray.400')}
      >
        {t(`${featureKey}.description`)}
      </Text>
    </Box>
  );
};

export default function FeaturesSection({ id }: { id: string }) {
  const textColor = useColorModeValue('gray.900', 'white');
  const svgFillColor = useColorModeValue('blue.300', 'blue.600');
  const paragraphColor = useColorModeValue('gray.700', 'gray.300');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const t = useTranslations('HomePage.features');

  return (
    <Box
      id={id}
      as="section"
      position="relative"
      overflow="hidden"
      bg={bgColor}
      py={{ base: 16, lg: 24 }}
    >
      <Container maxW="container.xl" position="relative" zIndex={10}>
        <Box
          maxW={{ base: '2xl', xl: 'none' }}
          mx="auto"
          textAlign={{ base: 'center', md: 'center' }}
        >
          <Heading
            as="h2"
            fontSize={{ base: '3xl', sm: '4xl' }}
            letterSpacing="tight"
            color={textColor}
            mb={6}
          >
            <Box as="span" position="relative" display="inline-block">
              <SwirlyDoodle
                position="absolute"
                left={0}
                top="50%"
                h="1em"
                w="full"
                fill={svgFillColor}
              />
              <Box as="span" position="relative">
                {t('title.prefix')}
              </Box>
            </Box>{' '}
            {t('title.suffix')}
          </Heading>
          <Text
            fontSize="lg"
            letterSpacing="tight"
            px={{ base: 4, md: 8 }}
            color={paragraphColor}
            mb={12}
          >
            {t('description')}
          </Text>
        </Box>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={8}
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.key}
              featureKey={feature.key}
              icon={feature.icon}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

import {
  Avatar,
  Box,
  CardBody,
  CardHeader,
  Card as ChakraCard,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import React from 'react';

interface CardProps {
  avatarSrc: string;
  avatarName: string;
  heading: string;
  subheading: string;
  bodyText: string;
  imageSrc: string;
  imageAlt: string;
}

const Card: React.FC<CardProps> = ({
  avatarSrc,
  avatarName,
  heading,
  subheading,
  bodyText,
  imageSrc,
  imageAlt,
}) => {
  return (
    <ChakraCard maxW="md">
      <CardHeader>
        <Flex gap="4">
          <Flex
            flex="1"
            gap="4"
            alignItems="center"
            justifyContent={'center'}
            flexWrap="wrap"
          >
            <Avatar name={avatarName} src={avatarSrc} />
            <Box>
              <Heading size="sm">{heading}</Heading>
              <Text>{subheading}</Text>
            </Box>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>{bodyText}</Text>
      </CardBody>
      <Image objectFit="cover" src={imageSrc} alt={imageAlt} />
    </ChakraCard>
  );
};

export default Card;

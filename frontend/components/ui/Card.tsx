import React from 'react';
import {
  Card as ChakraCard,
  CardHeader,
  Flex,
  Avatar,
  Box,
  Heading,
  Text,
  CardBody,
  Image,
  CardFooter,
} from '@chakra-ui/react';
import Button from './Button';

interface CardProps {
  avatarSrc: string;
  avatarName: string;
  heading: string;
  subheading: string;
  bodyText: string;
  imageSrc: string;
  imageAlt: string;
  onCommentClick?: () => void;
  onShareClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  avatarSrc,
  avatarName,
  heading,
  subheading,
  bodyText,
  imageSrc,
  imageAlt,
  onCommentClick,
  onShareClick,
}) => {
  return (
    <ChakraCard maxW="md">
      <CardHeader>
        <Flex gap="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
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
      <CardFooter justify="space-between" flexWrap="wrap">
        <Button onClick={onCommentClick}>Comment</Button>
        <Button onClick={onShareClick}>Share</Button>
      </CardFooter>
    </ChakraCard>
  );
};

export default Card;

import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Spacer,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';

import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface NavItem {
  label: string;
  children?: Array<NavItem>;
  href?: string;
}
const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'home',
    href: '#hero',
  },
  {
    label: 'features',
    href: '#features',
  },
  {
    label: 'techStack',
    href: '#stack',
  },
];

const DesktopSubNav = ({ label, href }: NavItem) => {
  return (
    <Link
      as={NextLink}
      href={href}
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition="all .3s ease"
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}
          >
            {label}
          </Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="pink.400" w={5} h={5} as={FiChevronRight} />
        </Flex>
      </Stack>
    </Link>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const t = useTranslations('Header.navigation');

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link
                as={NextLink}
                p={2}
                href={navItem.href ?? '#'}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {t(navItem.label)}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={popoverContentBgColor}
                p={4}
                rounded="xl"
                minW="sm"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();
  const t = useTranslations('Header.navigation');

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify="space-between"
        align="center"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {t(label)}
        </Text>
        {children && (
          <Icon
            as={FiChevronDown}
            transition="all .25s ease-in-out"
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align="start"
        >
          {children &&
            children.map((child) => (
              <Link as={NextLink} key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const textColorPrimary = useColorModeValue('#363636', '#FFFFFF');
  const textColorSecondary = useColorModeValue('#2563EB', '#60A5FA');
  const t = useTranslations();

  return (
    <>
      <Text
        id="atafin"
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        color={useColorModeValue('gray.600', 'gray.200')}
      >
        {t('Header.navigation.home')}
      </Text>
      <Box height="60px" />

      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex={1000}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        width="100%"
      >
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle="solid"
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align="center"
        >
          <Flex
            flex={{ base: 1 }}
            justify={{ base: 'left', md: 'start' }}
            align="center"
          >
            <Link
              as={NextLink}
              href="/"
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
            >
              <Box
                width={{ base: '60px', md: '345px' }}
                height={{ base: '30px', md: '75px' }}
                display="flex"
                alignItems="center"
              >
                {/* Mobile Logo (NS only) */}
                <Box display={{ base: 'block', md: 'none' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 1500 800"
                    style={{
                      filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))',
                    }}
                  >
                    <text
                      x="65"
                      y="600"
                      fontFamily="Sofia"
                      fontSize="700"
                      fill={textColorPrimary}
                    >
                      N
                    </text>
                    <text
                      x="650"
                      y="600"
                      fontFamily="Sofia"
                      fontSize="700"
                      fill={textColorSecondary}
                    >
                      S
                    </text>
                  </svg>
                </Box>

                {/* Desktop Logo (full version) - keeping the same */}
                <Box display={{ base: 'none', md: 'block' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 3500 800"
                    style={{
                      filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))',
                    }}
                  >
                    <text
                      x="65"
                      y="517.16989"
                      fontFamily="Sofia"
                      fontSize="420"
                      fill={textColorPrimary}
                    >
                      N
                    </text>
                    <text
                      x="459.65217"
                      y="517.16989"
                      fontFamily="Sofia"
                      fontSize="420"
                      fill={textColorSecondary}
                    >
                      S
                    </text>
                    <text
                      x="800"
                      y="517.16989"
                      fontFamily="Afacad"
                      fontSize="159"
                      fontStyle="italic"
                      fill={textColorSecondary}
                    >
                      NEXTJS
                    </text>
                    <text
                      x="1200"
                      y="517.16989"
                      fontFamily="Afacad"
                      fontSize="159"
                      fontStyle="italic"
                      fill={textColorPrimary}
                    >
                      STARTER KIT
                    </text>
                  </svg>
                </Box>
              </Box>
            </Link>
          </Flex>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
          <Spacer />
          <Stack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={3}
          >
            <LanguageSwitcher />
            <ThemeToggle />
            <Spacer />
            <Flex
              flex={{ base: 1, md: 'auto' }}
              ml={{ base: -2 }}
              display={{ base: 'flex', md: 'none' }}
            >
              <IconButton aria-label="Toggle Navigation" onClick={onToggle}>
                {isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
              </IconButton>
            </Flex>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    </>
  );
};

export default Header;

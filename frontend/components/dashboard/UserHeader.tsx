import React, { useState } from 'react';
import {
  Flex,
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon, AddIcon } from '@chakra-ui/icons';
import {
  FaBars,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaShareAlt,
  FaPalette,
  FaUserShield,
} from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface UserHeaderProps {
  user: { username: string; avatar: string; isAdmin?: boolean };
  onUpload: () => void;
  onToggleSidebar?: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  onUpload,
  onToggleSidebar,
}) => {
  const t = useTranslations('UserHeader');
  const [menuOpen, setMenuOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('var(--bg-secondary)', 'var(--bg-secondary)');
  const border = useColorModeValue(
    'var(--border-primary)',
    'var(--border-primary)',
  );

  return (
    <Flex
      as="header"
      bg={bg}
      borderBottom="1px"
      borderColor={border}
      px={4}
      py={3}
      align="center"
      justify="space-between"
      flexShrink={0}
      zIndex={50}
      position="relative"
    >
      {/* Left: menu + logo + title */}
      <Flex align="center" gap={4}>
        {onToggleSidebar && (
          <IconButton
            aria-label="menu"
            icon={<FaBars />}
            onClick={onToggleSidebar}
            variant="ghost"
            rounded="lg"
            _hover={{ bg: 'var(--bg-tertiary)' }}
          />
        )}
        <Flex align="center" gap={3}>
          <Box as="img" src="/favicon.svg" alt="Logo" w={8} h={8} />
          <Text fontWeight="bold" fontSize="xl" color="var(--text-primary)">
            Speakr
          </Text>
        </Flex>
      </Flex>
      {/* Right: upload + user menu */}
      <Flex align="center" gap={3}>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          px={3}
          py={1.5}
          bg="var(--bg-button)"
          color="var(--text-button)"
          rounded="lg"
          _hover={{ bg: 'var(--bg-button-hover)' }}
          fontSize="sm"
          onClick={onUpload}
        >
          <Text display={{ base: 'none', sm: 'inline' }}>
            {t('upload', { defaultValue: 'Tải lên mới' })}
          </Text>
        </Button>
        <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          <MenuButton
            as={Button}
            onClick={() => setMenuOpen((v) => !v)}
            leftIcon={<FaUserCircle />}
            rightIcon={<ChevronDownIcon fontSize="xs" />}
            variant="outline"
            size="sm"
            px={2}
            py={2}
            rounded="lg"
            _hover={{ bg: 'var(--bg-tertiary)' }}
            fontWeight="normal"
          >
            <Text display={{ base: 'none', sm: 'inline' }}>
              {user.username || 'User'}
            </Text>
          </MenuButton>
          <MenuList minW="220px" zIndex={100}>
            <MenuItem icon={<FaCog />}>
              {t('profile', { defaultValue: 'Hồ sơ' })}
            </MenuItem>
            {user.isAdmin && <MenuItem icon={<FaUserShield />}>Admin</MenuItem>}
            <MenuItem icon={<FaShareAlt />}>
              {t('shared', { defaultValue: 'Shared Transcripts' })}
            </MenuItem>
            <MenuItem
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
            >
              {colorMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </MenuItem>
            <MenuItem icon={<FaPalette />}>
              {t('color', { defaultValue: 'Color Scheme' })}
            </MenuItem>
            <MenuItem icon={<FaSignOutAlt />}>
              {t('logout', { defaultValue: 'Đăng xuất' })}
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default UserHeader;

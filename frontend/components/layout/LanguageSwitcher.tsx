// LanguageSwitcher.tsx
import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Text,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    flag: 'https://flagcdn.com/w20/us.png',
  },
  {
    code: 'vn',
    name: 'Tiếng Việt',
    flag: 'https://flagcdn.com/w20/vn.png',
  },
];

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find((lang) => lang.code === locale) || languages[0],
  );

  const menuBg = useColorModeValue('white', 'gray.800');
  const menuHoverBg = useColorModeValue('gray.100', 'gray.700');
  const buttonBg = useColorModeValue('white', 'gray.800');
  const buttonColor = useColorModeValue('gray.600', 'gray.300');

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    const normalizedPath = pathname.replace(/^\/(en|vn)/, '') || '/';

    router.push(normalizedPath, { locale: language.code });
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        bg={buttonBg}
        color={buttonColor}
        px={4}
        py={2}
        rounded="md"
        _hover={{ bg: menuHoverBg }}
        aria-label={`Select language, current: ${currentLanguage.name}`}
      >
        <HStack spacing={2}>
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            width="20px"
            height="15px"
          />
          <Text textTransform="uppercase">{currentLanguage.code}</Text>
          <FiChevronDown />
        </HStack>
      </MenuButton>
      <MenuList bg={menuBg}>
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            _hover={{ bg: menuHoverBg }}
          >
            <HStack>
              <Image
                src={language.flag}
                alt={language.name}
                width="24px"
                height="16px"
              />
              <Text>{language.name}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from '@chakra-ui/react';
import AdminUserTable from './AdminUserTable';
import AdminStats from './AdminStats';
import AdminSettings from './AdminSettings';
import { useTranslations } from 'next-intl';

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const t = useTranslations('AdminDashboard');

  return (
    <Box
      w="100vw"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
      _dark={{ bg: 'gray.900' }}
    >
      <Box
        width={{ base: '100%', md: '800px', lg: '1200px' }}
        minH={{ base: '600px', md: '700px', lg: '800px' }}
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        p={{ base: 4, md: 8, lg: 12 }}
        mb={8}
        overflow="auto"
        maxH="90vh"
        mx={2}
      >
        <Heading
          as="h2"
          size="2xl"
          mb={8}
          textAlign="center"
          color="blue.600"
          _dark={{ color: 'blue.300' }}
        >
          {t('title', { defaultValue: 'Admin Dashboard' })}
        </Heading>
        <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed">
          <TabList>
            <Tab fontWeight="bold">
              {t('userManagement', { defaultValue: 'User Management' })}
            </Tab>
            <Tab fontWeight="bold">
              {t('statistics', { defaultValue: 'Statistics' })}
            </Tab>
            <Tab fontWeight="bold">
              {t('systemSettings', { defaultValue: 'System Settings' })}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <AdminUserTable />
            </TabPanel>
            <TabPanel px={0}>
              <AdminStats />
            </TabPanel>
            <TabPanel px={0}>
              <AdminSettings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default AdminDashboard;

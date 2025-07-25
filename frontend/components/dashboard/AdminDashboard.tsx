'use client';
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
      h="80vh"
      w="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="var(--input-bg-light)"
      _dark={{ bg: 'var(--input-bg-dark)' }}
    >
      <Box
        width={'100%'}
        minH={{ base: '600px', md: '700px', lg: '800px' }}
        bg="var(--input-bg-light)"
        _dark={{ bg: 'var(--input-bg-dark)' }}
        // borderRadius="2xl"
        // boxShadow="2xl"
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

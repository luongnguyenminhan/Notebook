import { createContext, useContext } from 'react';

interface DashboardRefreshContextType {
  refreshDashboard: () => void;
}

export const DashboardRefreshContext =
  createContext<DashboardRefreshContextType>({
    refreshDashboard: () => {},
  });

export const useDashboardRefresh = () => useContext(DashboardRefreshContext);

import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed requests up to 2 times
      refetchOnWindowFocus: false, // Disable refetching on window focus
    },
  },
});

export default queryClient;

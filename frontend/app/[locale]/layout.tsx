import { Metadata } from 'next';
import RootLayoutServer from '../RootLayoutServer';

export const metadata: Metadata = {
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};
export default RootLayoutServer;

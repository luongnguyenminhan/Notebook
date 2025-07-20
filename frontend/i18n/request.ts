import { getRequestConfig } from 'next-intl/server';
// import { locales } from './navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const messages = (await import(`./messages/${locale}.json`)).default;

  return {
    messages,
    locale,
  };
});

import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import FirstUserGate from '@/components/FirstUserGate';

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <FirstUserGate />;
}

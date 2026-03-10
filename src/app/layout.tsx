import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import '@/styles/styles.scss';
import localFont from 'next/font/local';

const roboto = localFont({
  src: [
    {
      path: '../styles/Roboto/Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../styles/Roboto/Roboto-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../styles/Roboto/Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Recipe Finder',
  description: 'Find the perfect recipes for every occasion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

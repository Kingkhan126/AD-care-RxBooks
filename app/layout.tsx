import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ADCareProvider } from '@/lib/context';
import { MainContentLayout } from '@/components/layout/MainContentLayout';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'AD CARE — Meds & Pharmacy Business Accounting',
  description: 'AD CARE is a modern cloud-based business accounting and financial management platform designed to help businesses manage sales, purchases, expenses, inventory, banking, accounting, reporting, automation, and financial operations from one unified system.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100 min-h-screen antialiased text-slate-900 overflow-x-hidden`}>
        <ADCareProvider>
          <MainContentLayout>{children}</MainContentLayout>
        </ADCareProvider>
      </body>
    </html>
  );
}

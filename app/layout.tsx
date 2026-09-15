import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ADCareProvider } from '@/lib/context';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={`${inter.className} bg-slate-100 min-h-screen antialiased text-slate-900`}>
        <ADCareProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-64 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto pt-16 p-6">
                {children}
              </main>
            </div>
            <AIAssistantDrawer />
          </div>
        </ADCareProvider>
      </body>
    </html>
  );
}

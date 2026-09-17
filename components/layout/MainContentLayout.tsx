'use client';

import React from 'react';
import { useADCare } from '@/lib/context';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

export const MainContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarCollapsed } = useADCare();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 w-full relative">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        } ml-0 min-w-0 w-full`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto pt-14 sm:pt-16 p-2 sm:p-4 md:p-6 w-full max-w-full">
          {children}
        </main>
      </div>
      <AIAssistantDrawer />
    </div>
  );
};

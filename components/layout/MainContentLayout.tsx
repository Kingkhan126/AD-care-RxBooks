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
          isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        } pl-0 overflow-hidden min-w-0 w-full`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto pt-16 p-3 sm:p-6 w-full max-w-full">
          {children}
        </main>
      </div>
      <AIAssistantDrawer />
    </div>
  );
};

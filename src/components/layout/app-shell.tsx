"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col lg:pl-64 transition-all duration-300">
        <Header title={title} />
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6 custom-scrollbar">
          <div className="mx-auto max-w-7xl animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation - visible on small screens */}
      <MobileNav />
    </div>
  );
}

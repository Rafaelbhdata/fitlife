"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-center py-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime">
            <Zap className="h-6 w-6 text-dark" strokeWidth={2.5} />
          </div>
          <span className="font-display text-3xl tracking-wider">FITLIFE</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>© 2026 FitLife. Tu compañero de fitness.</p>
      </footer>
    </div>
  );
}

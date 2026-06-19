'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import React from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-heritage-navy focus:text-white focus:rounded-md focus:shadow-2xl"
      >
        Skip to content
      </a>
      <Navbar />
      <PageTransition>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </PageTransition>
      <Footer />
    </>
  );
}

import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} ${playfair.variable} min-h-screen bg-[#FDFCF8] font-sans text-[#333333]`}>
      <div className="flex flex-col md:flex-row">
        <AdminNavbar />
        <main className="flex-1 p-4 md:p-8 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  Calendar,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Batches', href: '/admin/batches', icon: Layers },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'People', href: '/admin/people', icon: Users },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#1A2B48] text-[#FDFCF8] z-50">
        <div className="p-8 border-b border-[#D4AF37]/20">
          <Link href="/admin" className="block">
            <h1 className="font-playfair text-2xl text-[#D4AF37]">Admin</h1>
            <p className="text-xs text-[#FDFCF8]/60 uppercase tracking-widest mt-1">Archive Manager</p>
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-[#D4AF37] text-[#1A2B48] font-medium"
                    : "hover:bg-[#FDFCF8]/10 text-[#FDFCF8]/70 hover:text-[#FDFCF8]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[#1A2B48]" : "text-[#D4AF37]/60 group-hover:text-[#D4AF37]")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-4 bg-[#1A2B48] text-[#FDFCF8] sticky top-0 z-50 shadow-lg">
        <Link href="/admin">
          <h1 className="font-playfair text-xl text-[#D4AF37]">Admin Archive</h1>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#D4AF37]"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#1A2B48] z-[60] md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#D4AF37]/20">
              <h1 className="font-playfair text-xl text-[#D4AF37]">Menu</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#D4AF37]">
                <X />
              </button>
            </div>

            <nav className="flex-1 py-8 px-6 space-y-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-4 px-6 py-4 rounded-xl text-lg transition-all",
                      isActive
                        ? "bg-[#D4AF37] text-[#1A2B48]"
                        : "text-[#FDFCF8]/70"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-8 border-t border-[#D4AF37]/20">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-4 px-6 py-4 w-full text-left rounded-xl text-red-400 bg-red-500/5"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-lg">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for desktop sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}

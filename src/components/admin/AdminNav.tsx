'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { LayoutDashboard, Calendar, Users, Image, UploadCloud, LogOut } from 'lucide-react'

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Batches', href: '/admin/batches', icon: Calendar },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'People', href: '/admin/people', icon: Users },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Upload', href: '/admin/upload', icon: UploadCloud },
  ]

  const handleLogout = async () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.href = '/admin/login'
  }

  return (
    <nav className="bg-white border-b border-parchment-dark/30 sticky top-0 z-50 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif text-xl text-heritage-navy flex items-center gap-2">
              <span className="italic font-bold">Jules</span> Admin
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                    pathname === item.href
                      ? 'bg-heritage-navy text-white shadow-lg'
                      : 'text-charcoal-muted hover:bg-parchment-muted'
                  }`}
                >
                  <item.icon size={14} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-charcoal-muted hover:text-red-600 transition-colors p-2"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </Container>
    </nav>
  )
}

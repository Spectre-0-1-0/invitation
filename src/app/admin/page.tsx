import { getArchiveStats } from './dashboard-stats';
import Link from 'next/link';
import {
  Layers,
  Calendar,
  Users,
  Image as ImageIcon,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Upload,
  UserPlus
} from 'lucide-react';

export default async function AdminDashboard() {
  const stats = await getArchiveStats();

  const cards = [
    { name: 'Total Batches', value: stats?.batches || 0, icon: Layers, color: 'text-blue-500' },
    { name: 'Total Events', value: stats?.events || 0, icon: Calendar, color: 'text-green-500' },
    { name: 'Total People', value: stats?.people || 0, icon: Users, color: 'text-purple-500' },
    { name: 'Media Assets', value: stats?.media || 0, icon: ImageIcon, color: 'text-amber-500' },
  ];

  const quickActions = [
    { name: 'Add Senior', href: '/admin/people', icon: UserPlus, color: 'bg-purple-500' },
    { name: 'Upload Photo', href: '/admin/media', icon: Upload, color: 'bg-amber-500' },
    { name: 'Add Event', href: '/admin/events', icon: Plus, color: 'bg-green-500' },
    { name: 'Add Memory', href: '/admin/memories', icon: MessageSquare, color: 'bg-blue-500' },
  ];

  const healthIssues = stats?.health.totalIssues || 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-playfair text-4xl text-[#1A2B48] mb-2">Dashboard</h1>
          <p className="text-[#333333]/60">Welcome back, organizer. Here&apos;s the state of the archive.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-[#FDFCF8] ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-[#1A2B48]">{stat.value}</span>
            </div>
            <p className="text-sm text-[#333333]/40 font-medium uppercase tracking-wider">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-[#D4AF37]/20 shadow-sm">
        <h2 className="font-playfair text-2xl text-[#1A2B48] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex flex-col items-center p-6 rounded-xl bg-[#FDFCF8] border border-[#1A2B48]/5 hover:border-[#D4AF37] hover:shadow-md transition-all group"
            >
              <div className={`p-4 rounded-full ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="font-serif font-medium text-[#1A2B48]">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-[#FDFCF8] flex items-center justify-between">
            <h2 className="font-playfair text-xl text-[#1A2B48]">Archive Health</h2>
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="p-6">
            {healthIssues === 0 ? (
              <div className="flex items-center space-x-3 text-green-600 bg-green-50 p-4 rounded-lg border border-green-100">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-bold">Perfect Integrity</p>
                  <p className="text-sm opacity-80">No orphaned records found.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <p className="font-bold">{healthIssues} Issues Detected</p>
                  <p className="text-sm opacity-80">Check for orphaned media.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D4AF37]/10 bg-[#FDFCF8] flex items-center justify-between">
            <h2 className="font-playfair text-xl text-[#1A2B48]">Distribution</h2>
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#333333]/60">Total Memories</span>
                <span className="text-sm font-bold text-[#1A2B48]">{stats?.messages || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

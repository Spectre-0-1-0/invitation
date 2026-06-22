import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export function Footer() {
  return (
    <footer className="bg-heritage-navy text-white py-12 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tighter">
              Archive <span className="text-champagne-gold">2025</span>
            </h3>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              Preserving the memories, stories, and legacy of our time together.
              Built for the seniors of today and the alumni of tomorrow.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/seniors" className="text-sm text-white/60 hover:text-white transition-colors">Seniors</Link>
              <Link href="/gallery" className="text-sm text-white/60 hover:text-white transition-colors">Gallery</Link>
              <Link href="/timeline" className="text-sm text-white/60 hover:text-white transition-colors">Timeline</Link>
              <Link href="/messages" className="text-sm text-white/60 hover:text-white transition-colors">Messages</Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold">Community</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Want to contribute a photo or story? Reach out to the archive team.
            </p>
            <div className="pt-4 border-t border-white/10">
               <Link href="/admin/login" className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-champagne-gold transition-colors">
                  Staff Access
               </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            © {new Date().getFullYear()} College Memory Archive. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {/* Add social links if needed */}
          </div>
        </div>
      </Container>
    </footer>
  );
}

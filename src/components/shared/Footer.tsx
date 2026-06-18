import { Container } from "@/components/layout/Container";
import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-parchment-dark/30 bg-white py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold text-heritage-navy tracking-tighter mb-6 block">
              Archive <span className="text-champagne-gold">2025</span>
            </Link>
            <p className="text-charcoal-muted max-w-sm font-serif italic text-lg leading-relaxed">
              &quot;A digital sanctuary for the stories, laughter, and lifelong bonds forged during our time together.&quot;
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-navy mb-6">Archive</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-charcoal-muted">
              <li><Link href="/seniors" className="hover:text-champagne-gold transition-colors">The Seniors</Link></li>
              <li><Link href="/gallery" className="hover:text-champagne-gold transition-colors">Gallery</Link></li>
              <li><Link href="/timeline" className="hover:text-champagne-gold transition-colors">Timeline</Link></li>
              <li><Link href="/tribute" className="hover:text-champagne-gold transition-colors text-heritage-navy">Final Tribute</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-heritage-navy mb-6">Discovery</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-charcoal-muted">
              <li><Link href="/messages" className="hover:text-champagne-gold transition-colors">Message Wall</Link></li>
              <li><Link href="/memes" className="hover:text-champagne-gold transition-colors">Hall of Memes</Link></li>
              <li><Link href="/achievements" className="hover:text-champagne-gold transition-colors">Honors</Link></li>
              <li><Link href="/admin/login" className="hover:text-heritage-navy transition-colors opacity-30">Curation</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-parchment-muted flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.1em] text-charcoal-muted opacity-60">
            <span>&copy; {currentYear} College Memory Archive</span>
            <span className="hidden md:inline">&bull;</span>
            <span>Class of 2025 Legacy Project</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-heritage-navy">
            <span>Made with</span>
            <Heart size={10} className="text-burnt-sienna fill-burnt-sienna" aria-hidden="true" />
            <span>for our batch</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

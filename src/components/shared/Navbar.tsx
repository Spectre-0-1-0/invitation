"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const navItems = [
    { name: "Seniors", path: "/seniors" },
    { name: "Gallery", path: "/gallery" },
    { name: "Timeline", path: "/timeline" },
    { name: "Messages", path: "/messages" },
  ];

  const moreItems = [
    { name: "Memes", path: "/memes" },
    { name: "Achievements", path: "/achievements" },
    { name: "Videos", path: "/videos" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowMore(false);
    if (typeof window !== "undefined") {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    }
  }, [pathname, isOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-parchment-base/95 backdrop-blur-md border-b border-parchment-dark/30 shadow-sm py-3"
          : "bg-transparent py-6"
      )}
    >
      <Container className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-heritage-navy tracking-tighter group">
          Archive <span className="text-champagne-gold group-hover:text-burnt-sienna transition-colors">2025</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-champagne-gold relative py-1",
                pathname.startsWith(item.path)
                  ? "text-heritage-navy after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-champagne-gold"
                  : "text-charcoal-muted"
              )}
            >
              {item.name}
            </Link>
          ))}

          <div className="relative">
            <button
              onMouseEnter={() => setShowMore(true)}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted hover:text-heritage-navy transition-colors"
            >
              More <ChevronDown size={12} className={cn("transition-transform duration-300", showMore && "rotate-180")} />
            </button>
            {showMore && (
              <div
                onMouseLeave={() => setShowMore(false)}
                className="absolute top-full right-0 mt-4 w-52 bg-white border border-parchment-dark shadow-2xl rounded-md overflow-hidden py-3 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                {moreItems.map(item => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="block px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-charcoal-muted hover:bg-parchment-muted hover:text-heritage-navy transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/tribute"
            className="px-6 py-2.5 bg-heritage-navy text-white text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-burnt-sienna transition-all duration-500 font-bold shadow-lg shadow-heritage-navy/20"
          >
            Final Tribute
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-heritage-navy focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-[70px] bg-parchment-base transition-all duration-500 md:hidden z-40 overflow-y-auto",
          isOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-4"
        )}
      >
        <nav className="flex flex-col p-8 gap-2">
           <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-champagne-gold mb-4 block">Main Sections</span>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-3xl font-serif py-4 border-b border-parchment-dark/30",
                pathname.startsWith(item.path) ? "text-heritage-navy italic" : "text-charcoal-muted"
              )}
            >
              {item.name}
            </Link>
          ))}
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-champagne-gold mt-8 mb-4 block">Discover More</span>
          <div className="grid grid-cols-2 gap-4">
             {moreItems.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="p-4 bg-white border border-parchment-dark/30 rounded-md text-sm font-bold uppercase tracking-widest text-heritage-navy"
                >
                  {item.name}
                </Link>
             ))}
          </div>
          <Link
            href="/tribute"
            className="mt-12 w-full py-5 bg-heritage-navy text-white text-center rounded-md font-bold uppercase tracking-[0.3em] text-xs"
          >
            Final Tribute
          </Link>
        </nav>
      </div>
    </header>
  );
}

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
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-parchment-base/90 backdrop-blur-md border-b shadow-sm py-2"
          : "bg-transparent py-4"
      )}
    >
      <Container className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-heritage-navy tracking-tight">
          Archive <span className="text-champagne-gold">2025</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium transition-all hover:text-champagne-gold relative py-1",
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
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-1 text-sm font-medium text-charcoal-muted hover:text-heritage-navy transition-colors"
            >
              More <ChevronDown size={14} className={cn("transition-transform", showMore && "rotate-180")} />
            </button>
            {showMore && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-parchment-muted shadow-xl rounded-md overflow-hidden py-2">
                {moreItems.map(item => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="block px-4 py-2 text-sm text-charcoal-muted hover:bg-parchment-muted hover:text-heritage-navy transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/tribute"
            className="px-5 py-2 bg-heritage-navy text-white text-sm rounded-md hover:bg-opacity-90 transition-all font-medium"
          >
            Final Tribute
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-heritage-navy"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </Container>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-parchment-base border-b shadow-lg transition-all duration-300 overflow-hidden md:hidden",
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col p-6 gap-2">
          {[...navItems, ...moreItems].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-lg font-medium py-3 border-b border-parchment-muted",
                pathname.startsWith(item.path) ? "text-heritage-navy" : "text-charcoal-muted"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/tribute"
            className="mt-4 w-full py-4 bg-heritage-navy text-white text-center rounded-md font-medium"
          >
            Final Tribute
          </Link>
        </nav>
      </div>
    </header>
  );
}

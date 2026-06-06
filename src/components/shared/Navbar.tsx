import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function Navbar() {
  const navItems = [
    { name: "Seniors", path: "/seniors" },
    { name: "Gallery", path: "/gallery" },
    { name: "Timeline", path: "/timeline" },
    { name: "Messages", path: "/messages" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-parchment-base/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-heritage-navy">
          Class of 2025
        </Link>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-sm font-medium hover:text-champagne-gold transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}

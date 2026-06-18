import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Caveat } from "next/font/google";
import "@/styles/globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const viewport: Viewport = {
  themeColor: "#1A2B48",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | College Memory Archive",
    default: "College Memory Archive | Class of 2025",
  },
  description: "A digital archive preserving memories, achievements, and messages for the graduating class of 2025.",
  metadataBase: new URL("https://archive.college.edu"), // Update with actual URL
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://archive.college.edu",
    siteName: "College Memory Archive",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "College Memory Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "College Memory Archive | Class of 2025",
    description: "A digital archive preserving memories, achievements, and messages.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${caveat.variable} antialiased font-sans`}>
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

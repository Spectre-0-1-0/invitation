import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { MainLayout } from "@/components/layout/MainLayout";
import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    template: "%s | College Memory Archive",
    default: "College Memory Archive | Class of 2025",
  },
  description: "A digital archive preserving memories, achievements, and messages for the graduating class of 2025.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} antialiased font-sans`}>
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}

import React from 'react';

interface ScrapbookDeskProps {
  children: React.ReactNode;
}

export const ScrapbookDesk: React.FC<ScrapbookDeskProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#2a1b15] py-12 px-4 md:py-20 md:px-0 flex justify-center items-start overflow-x-hidden selection:bg-champagne-gold/30">
      {/* Wood Grain / Desk Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />

      {/* Subtle Dust/Grain */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[10] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 w-full max-w-6xl">
        {children}
      </div>
    </div>
  );
};

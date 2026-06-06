import React from 'react';
import { motion } from 'framer-motion';

interface ScrapbookPageProps {
  children: React.ReactNode;
  className?: string;
  type?: 'notebook' | 'journal' | 'aged' | 'plain';
}

export const ScrapbookPage: React.FC<ScrapbookPageProps> = ({
  children,
  className = '',
  type = 'notebook'
}) => {
  const getPageStyles = () => {
    switch (type) {
      case 'notebook':
        return 'bg-parchment-base border-l-4 border-l-blue-200 bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:100%_1.5rem]';
      case 'journal':
        return 'bg-parchment-muted shadow-inner';
      case 'aged':
        return 'bg-[#f4ecd8] shadow-md border-parchment-dark/30';
      default:
        return 'bg-parchment-base';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative min-h-[80vh] w-full p-8 md:p-16 shadow-2xl rounded-sm ${getPageStyles()} ${className}`}
      style={{
        boxShadow: '0 10px 50px -10px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.1)'
      }}
    >
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

      {/* Torn Edge Effect (Simulated) */}
      <div className="absolute -left-1 top-0 bottom-0 w-2 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

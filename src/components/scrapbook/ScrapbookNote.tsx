import React from 'react';
import { motion } from 'framer-motion';

type HandwritingPersona = 'neat' | 'chaotic' | 'artist' | 'clown' | 'emotional';

interface ScrapbookNoteProps {
  children: React.ReactNode;
  persona?: HandwritingPersona;
  x?: string;
  y?: string;
  rotate?: number;
  width?: string;
  type?: 'sticky' | 'torn' | 'plain';
}

export const ScrapbookNote: React.FC<ScrapbookNoteProps> = ({
  children,
  persona = 'neat',
  x = '0%',
  y = '0%',
  rotate = 0,
  width = 'auto',
  type = 'plain'
}) => {
  const getHandwritingClass = () => {
    switch (persona) {
      case 'neat': return 'font-serif text-blue-900 italic';
      case 'chaotic': return 'font-sans uppercase tracking-tighter text-charcoal font-black scale-y-110';
      case 'artist': return 'font-serif text-burnt-sienna font-bold';
      case 'clown': return 'font-mono text-pink-600 font-bold decoration-wavy underline';
      case 'emotional': return 'font-serif text-heritage-navy opacity-80';
      default: return 'font-sans';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'sticky':
        return 'bg-yellow-100 p-4 shadow-md border-b-2 border-yellow-200';
      case 'torn':
        return 'bg-parchment-dark/30 p-2 border-dashed border-2 border-black/10';
      default:
        return 'p-1';
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        rotate: rotate,
        width: width,
        zIndex: 30
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${getTypeStyles()} ${getHandwritingClass()} leading-tight text-lg`}
    >
      {children}
    </motion.div>
  );
};

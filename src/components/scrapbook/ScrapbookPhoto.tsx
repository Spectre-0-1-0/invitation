'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ScrapbookPhotoProps {
  src: string;
  alt: string;
  caption?: string;
  x?: string;
  y?: string;
  rotate?: number;
  width?: string;
  type?: 'polaroid' | 'print' | 'snapshot';
  handwriting?: string;
  hiddenMemory?: React.ReactNode;
}

export const ScrapbookPhoto: React.FC<ScrapbookPhotoProps> = ({
  src,
  alt,
  caption,
  x = '0%',
  y = '0%',
  rotate = 0,
  width = '200px',
  type = 'polaroid',
  handwriting = 'font-serif',
  hiddenMemory
}) => {
  const [isLifting, setIsLifting] = useState(false);

  const getFrameStyles = () => {
    switch (type) {
      case 'polaroid':
        return 'bg-white p-2 pb-8 shadow-polaroid border border-black/5';
      case 'print':
        return 'bg-white p-1 shadow-scrapbook';
      case 'snapshot':
        return 'shadow-md rounded-sm';
      default:
        return '';
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
        zIndex: isLifting ? 50 : 20
      }}
      whileHover={{ scale: 1.02, rotate: rotate + (Math.random() * 2 - 1) }}
      className="cursor-pointer group"
      onClick={() => hiddenMemory && setIsLifting(!isLifting)}
    >
      {/* Hidden Memory Revealed Underneath */}
      <AnimatePresence>
        {isLifting && hiddenMemory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-parchment-dark p-4 rounded-sm shadow-inner z-[-1] flex items-center justify-center text-center overflow-hidden"
          >
            {hiddenMemory}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          y: isLifting ? -100 : 0,
          rotateX: isLifting ? 45 : 0,
          rotateZ: isLifting ? rotate + 5 : rotate
        }}
        transition={{ type: 'spring', damping: 15 }}
        className={`${getFrameStyles()} overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl`}
      >
        <div className="relative aspect-square w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        </div>
        {type === 'polaroid' && caption && (
          <div className={`mt-2 text-center text-sm text-charcoal/80 ${handwriting}`}>
            {caption}
          </div>
        )}
      </motion.div>

      {/* Simulated Tape */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 backdrop-blur-[1px] rotate-2 shadow-sm pointer-events-none" />
    </motion.div>
  );
};

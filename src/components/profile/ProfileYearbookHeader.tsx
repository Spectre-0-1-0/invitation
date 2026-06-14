'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"

interface ProfileYearbookHeaderProps {
  name: string
  image?: string
  major?: string
  batch?: string
  quote?: string
  signatureMoment?: string
}

export function ProfileYearbookHeader({
  name,
  image,
  major,
  batch,
  quote,
  signatureMoment
}: ProfileYearbookHeaderProps) {
  return (
    <div className="relative pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full bg-white rotate-[-2deg] -z-10 shadow-sm border-y border-parchment-dark/30" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          {/* Yearbook Cutout Style Photo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="w-64 h-80 bg-parchment-muted border-[12px] border-white shadow-polaroid rotate-[-3deg] overflow-hidden group">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-heritage-navy/20 font-serif italic text-4xl">
                  {name[0]}
                </div>
              )}
            </div>
            {/* Scrapbook Tape */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/60 backdrop-blur-sm -rotate-6 border border-white/20 z-10" />
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-handwritten text-4xl text-champagne-gold mb-2 block">
                {name}
              </span>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                Class of <span className="italic">{batch || '2025'}</span>
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                <span className="px-4 py-1 border-2 border-heritage-navy/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-heritage-navy">
                  {major}
                </span>
              </div>

              {quote && (
                <div className="relative inline-block mt-8">
                   <p className="font-serif italic text-2xl md:text-3xl text-charcoal-muted leading-relaxed max-w-2xl">
                     &quot;{quote}&quot;
                   </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

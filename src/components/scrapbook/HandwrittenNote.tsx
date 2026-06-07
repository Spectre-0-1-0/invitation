'use client'

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface HandwrittenNoteProps {
  content: string
  from?: string
  relationship?: string
  rotation?: number
  className?: string
  color?: 'yellow' | 'blue' | 'pink' | 'white'
}

export function HandwrittenNote({
  content,
  from,
  relationship,
  rotation = 0,
  className,
  color = 'white'
}: HandwrittenNoteProps) {
  const colors = {
    white: 'bg-white border-parchment-dark/30',
    yellow: 'bg-[#FFF9C4] border-yellow-200/50',
    blue: 'bg-[#E3F2FD] border-blue-200/50',
    pink: 'bg-[#FCE4EC] border-pink-200/50',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: rotation - 1 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
      viewport={{ once: true }}
      className={cn(
        "p-8 shadow-scrapbook border relative overflow-hidden",
        colors[color],
        className
      )}
    >
      {/* Tape Effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm -rotate-2 border border-white/20" />

      <p className="font-handwritten text-3xl text-heritage-navy leading-relaxed mb-6">
        &quot;{content}&quot;
      </p>

      {from && (
        <div className="flex flex-col items-end">
          <span className="font-serif italic text-charcoal text-lg">— {from}</span>
          {relationship && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal-muted mt-1">
              {relationship}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

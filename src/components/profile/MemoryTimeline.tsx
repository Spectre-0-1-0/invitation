'use client'

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Polaroid } from "@/components/scrapbook/Polaroid"
import Link from "next/link"

interface TimelineEntry {
  id: string
  year: string
  title: string
  description?: string
  media: any[]
  slug?: string
}

interface MemoryTimelineProps {
  entries: TimelineEntry[]
}

export function MemoryTimeline({ entries }: MemoryTimelineProps) {
  return (
    <div className="relative py-24 space-y-32">
      {/* Central Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-parchment-dark to-transparent hidden md:block" />

      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={cn(
            "relative flex flex-col md:flex-row gap-12 md:gap-24 items-center",
            index % 2 === 0 ? "" : "md:flex-row-reverse"
          )}
        >
          <div className="w-full md:w-1/2 text-center md:text-right px-4">
             <div className={cn(
               "space-y-4",
               index % 2 === 0 ? "md:text-right" : "md:text-left"
             )}>
                <span className="font-mono text-xs uppercase tracking-widest text-champagne-gold font-bold">
                  {entry.year}
                </span>
                <Link href={`/events/${entry.slug}`} className="group">
                  <h3 className="text-3xl font-serif group-hover:text-champagne-gold transition-colors">
                    {entry.title}
                  </h3>
                </Link>
                <p className="text-charcoal-muted font-serif italic text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                  {entry.description}
                </p>
             </div>
          </div>

          {/* Timeline Node */}
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-heritage-navy border-4 border-parchment-base hidden md:block z-10 shadow-lg" />

          <div className="w-full md:w-1/2 px-4 flex justify-center">
             <div className="relative group">
                <Polaroid
                  src={entry.media[0]?.url || ''}
                  rotation={index % 2 === 0 ? 2 : -2}
                  className="w-64 md:w-72"
                />
                {/* Decorative Journal Fragment */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-parchment-dark opacity-10 rounded-full blur-2xl -z-10" />
             </div>
          </div>
        </div>
      ))}
    </div>
  )
}

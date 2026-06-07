'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play } from "lucide-react"

interface PolaroidProps {
  src: string
  title?: string
  caption?: string
  handwrittenCaption?: string
  type?: 'PHOTO' | 'VIDEO'
  rotation?: number
  className?: string
  priority?: boolean
}

export function Polaroid({
  src,
  title,
  caption,
  handwrittenCaption,
  type = 'PHOTO',
  rotation = 0,
  className,
  priority = false
}: PolaroidProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: rotation - 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true }}
      className={cn(
        "bg-white p-4 pb-12 shadow-polaroid border border-parchment-dark/30 inline-block",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-parchment-muted group">
        <Image
          src={src}
          alt={title || "Memory"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />
        {type === 'VIDEO' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-heritage-navy shadow-xl">
              <Play size={20} fill="currentColor" />
            </div>
          </div>
        )}
      </div>
      {(caption || handwrittenCaption) && (
        <div className="mt-4 px-1">
          <p className={cn(
            "text-charcoal-muted leading-tight",
            handwrittenCaption ? "font-handwritten text-2xl" : "text-xs font-serif italic"
          )}>
            {handwrittenCaption || caption}
          </p>
        </div>
      )}
    </motion.div>
  )
}

'use client'

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface Friend {
  id: string
  name: string
  image?: string
  slug: string
}

interface FriendshipClusterProps {
  friends: Friend[]
  title?: string
}

export function FriendshipCluster({ friends, title = "Often remembered together" }: FriendshipClusterProps) {
  if (friends.length === 0) return null

  return (
    <div className="py-12">
      <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-champagne-gold mb-10 text-center font-bold">
        {title}
      </h4>
      <div className="flex flex-wrap justify-center gap-12">
        {friends.map((friend, i) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Link href={`/people/${friend.slug}`} className="group flex flex-col items-center">
              <div className="relative w-20 h-20 rounded-full border-4 border-white shadow-scrapbook overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                {friend.image ? (
                  <Image src={friend.image} alt={friend.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-parchment-muted flex items-center justify-center text-heritage-navy/20 font-serif italic text-xl">
                    {friend.name[0]}
                  </div>
                )}
              </div>
              <span className="mt-4 text-[10px] font-bold uppercase tracking-widest text-charcoal-muted group-hover:text-heritage-navy transition-colors">
                {friend.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

import { getSeniorProfile, getMediaById } from "@/lib/data-fetcher"
import { notFound } from "next/navigation"
import { ProfileYearbookHeader } from "@/components/profile/ProfileYearbookHeader"
import { MemoryTimeline } from "@/components/profile/MemoryTimeline"
import { FriendshipCluster } from "@/components/profile/FriendshipCluster"
import { ScrapbookSection } from "@/components/scrapbook/ScrapbookSection"
import { Polaroid } from "@/components/scrapbook/Polaroid"
import { HandwrittenNote } from "@/components/scrapbook/HandwrittenNote"
import { Heading } from "@/components/ui/Heading"
import { MemoryCluster } from "@/components/scrapbook/MemoryCluster"
import { ArrowRight, Star, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"

export async function generateMetadata({ params }: any) {
  const { slug } = await params
  const senior = await getSeniorProfile(slug)
  return { title: senior?.name || "Senior Profile" }
}

export default async function SeniorProfilePage({ params }: any) {
  const { slug } = await params
  const senior = (await getSeniorProfile(slug)) as any
  if (!senior) notFound()

  const favoriteMemory = senior.favoriteMemoryId ? await getMediaById(senior.favoriteMemoryId) : null
  const signatureMoment = senior.signatureMomentMediaId ? await getMediaById(senior.signatureMomentMediaId) : null

  const timelineEntries = senior.eventsParticipated.map((event: any) => ({
    id: event.id,
    year: event.startDate ? new Date(event.startDate).getFullYear().toString() : '2025',
    title: event.title,
    description: event.shortDescription || event.description,
    media: event.media,
    slug: event.slug
  }))

  return (
    <div className="bg-parchment-base min-h-screen">
      <ProfileYearbookHeader
        name={senior.name}
        image={senior.image || undefined}
        major={senior.major || undefined}
        batch={senior.batch?.name}
        quote={senior.quote || undefined}
      />

      {/* Highlights Section */}
      {(favoriteMemory || signatureMoment) && (
        <ScrapbookSection className="bg-white/40 border-y border-parchment-dark/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {favoriteMemory && (
              <div className="space-y-8">
                <Heading level={2} className="text-3xl flex items-center gap-3">
                  <Heart size={24} className="text-red-400" /> Favorite <span className="italic">Memory</span>
                </Heading>
                <Polaroid
                  src={favoriteMemory.url}
                  handwrittenCaption="One for the books"
                  className="w-full max-w-md mx-auto md:mx-0"
                />
              </div>
            )}
            {signatureMoment && (
              <div className="space-y-8">
                <Heading level={2} className="text-3xl flex items-center gap-3">
                  <Star size={24} className="text-champagne-gold" /> Signature <span className="italic">Moment</span>
                </Heading>
                <div className="relative">
                  <Polaroid
                    src={signatureMoment.url}
                    rotation={3}
                    className="w-full max-w-md mx-auto md:mx-0"
                  />
                  {senior.signatureMomentText && (
                    <div className="mt-8 p-6 bg-parchment-muted/30 border border-dashed border-parchment-dark rounded-md">
                       <p className="font-serif italic text-charcoal-muted leading-relaxed">
                          {senior.signatureMomentText}
                       </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrapbookSection>
      )}

      {/* The Journey Timeline */}
      <ScrapbookSection>
        <div className="text-center mb-12">
          <Heading level={2} className="text-5xl mb-4">The <span className="italic">Journey</span></Heading>
          <p className="text-charcoal-muted font-serif italic text-lg">A chronological walk through shared moments.</p>
        </div>
        <MemoryTimeline entries={timelineEntries} />
      </ScrapbookSection>

      {/* Messages Fragment */}
      {(senior.messagesReceived.length > 0 || senior.messagesSent.length > 0) && (
        <ScrapbookSection className="bg-heritage-navy text-white">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              {senior.messagesReceived.length > 0 && (
                <div>
                  <Heading level={2} className="text-white text-3xl mb-12 flex items-center gap-3">
                    <MessageSquare size={20} className="text-champagne-gold" /> Messages <span className="italic">About Them</span>
                  </Heading>
                  <div className="space-y-8">
                    {senior.messagesReceived.slice(0, 3).map((msg: any, i: number) => (
                      <HandwrittenNote
                        key={msg.id}
                        content={msg.content}
                        from={msg.fromName}
                        rotation={i % 2 === 0 ? -1 : 1}
                        color={['white', 'yellow', 'blue', 'pink'][i % 4] as any}
                        className="text-heritage-navy"
                      />
                    ))}
                  </div>
                </div>
              )}
              {senior.messagesSent.length > 0 && (
                <div>
                  <Heading level={2} className="text-white text-3xl mb-12 flex items-center gap-3">
                    <MessageSquare size={20} className="text-champagne-gold" /> Written <span className="italic">By Them</span>
                  </Heading>
                  <div className="space-y-8 opacity-90">
                    {senior.messagesSent.slice(0, 3).map((msg: any, i: number) => (
                      <HandwrittenNote
                        key={msg.id}
                        content={msg.content}
                        from="Sent to a friend"
                        rotation={i % 2 === 0 ? 1 : -1}
                        className="text-heritage-navy"
                      />
                    ))}
                  </div>
                </div>
              )}
           </div>
        </ScrapbookSection>
      )}

      {/* Discovery Layer */}
      <ScrapbookSection>
        <FriendshipCluster
          friends={senior.relatedPeople.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            slug: p.slug
          }))}
        />

        <div className="mt-24 text-center border-t border-parchment-dark/30 pt-24">
           <Heading level={2} className="text-3xl mb-8">Want to see more <span className="italic">memories?</span></Heading>
           <Link
            href={`/gallery?seniorId=${senior.id}`}
            className="inline-flex items-center gap-3 bg-heritage-navy text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
           >
             Open Complete Archive <ArrowRight size={18} />
           </Link>
        </div>
      </ScrapbookSection>
    </div>
  )
}

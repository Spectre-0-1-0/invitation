import { PrismaClient, MediaType, ProcessingStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding realistic scenarios for Sprint 6...')

  const batch = await prisma.batch.upsert({
    where: { id: 'batch-2026' },
    update: {},
    create: {
      id: 'batch-2026',
      name: 'Batch 2026',
      graduationYear: 2026,
      description: 'The legends of the 2026 cohort.'
    }
  })

  // Create a default uploader/person if needed
  const rahul = await prisma.person.upsert({
    where: { slug: 'rahul-sharma' },
    update: {},
    create: {
      id: 'rahul-sharma',
      batchId: batch.id,
      name: 'Rahul Sharma',
      slug: 'rahul-sharma',
      major: 'Computer Science',
      quote: 'Building the future, one line of code at a time.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    }
  })

  const priya = await prisma.person.upsert({
    where: { slug: 'priya-patel' },
    update: {},
    create: {
      id: 'priya-patel',
      batchId: batch.id,
      name: 'Priya Patel',
      slug: 'priya-patel',
      major: 'Architecture',
      quote: 'Designing spaces that tell stories.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    }
  })

  const events = [
    {
      title: 'Freshers Party 2023',
      slug: 'freshers-party-2023',
      description: 'Where the journey began. Neon lights, loud music, and the first of many lifelong friendships. We walked in as strangers and left as a tribe.',
      chapterQuote: 'Everything started here.',
      chapterMood: 'EXCITED',
      chapterColorTheme: '#D4AF37',
      featured: true,
      location: 'Grand Ballroom',
      startDate: new Date('2023-09-15'),
      eventType: 'Party'
    },
    {
      title: 'Sports Fest 2024',
      slug: 'sports-fest-2024',
      description: 'Victory, sweat, and team spirit. The roar of the crowd and the thrill of the game. We pushed our limits and celebrated every win, together.',
      chapterQuote: 'Strength in unity.',
      chapterMood: 'ENERGETIC',
      featured: true,
      location: 'University Stadium',
      startDate: new Date('2024-03-20'),
      eventType: 'Sports'
    },
    {
      title: 'Farewell 2026',
      slug: 'farewell-2026',
      description: 'The final goodbye. Not just an end, but a new beginning. Tears, hugs, and the realization that these four years were the best of our lives.',
      chapterQuote: 'Till we meet again.',
      chapterMood: 'REFLECTIVE',
      featured: true,
      location: 'Central Lawn',
      startDate: new Date('2026-05-10'),
      eventType: 'Ceremony'
    }
  ]

  for (const eventData of events) {
    const event = await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: eventData,
      create: {
        ...eventData,
        batchId: batch.id,
        participants: {
          connect: [{ id: rahul.id }, { id: priya.id }]
        }
      }
    })

    // Create featured media for the event
    await prisma.media.create({
      data: {
        eventId: event.id,
        type: MediaType.PHOTO,
        url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
        title: 'Group Photo',
        featured: true,
        importance: 10,
        handwrittenCaption: 'The whole squad!',
        processingStatus: ProcessingStatus.COMPLETED
      }
    })

    // Create a message for the event
    await prisma.message.create({
      data: {
        eventId: event.id,
        fromName: 'Rahul Sharma',
        fromPersonId: rahul.id,
        content: `This ${event.title} was unforgettable! Can't wait for the next one.`,
        category: 'funny'
      }
    })
  }

  console.log('Seeded realistic events, participants, media, and messages.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

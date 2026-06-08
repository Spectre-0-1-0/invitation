import { PrismaClient, MediaType, ProcessingStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding enhanced realistic data for Sprint 7...')

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

  // Create People
  const rahul = await prisma.person.upsert({
    where: { slug: 'rahul-sharma' },
    update: {
      quote: 'Building the future, one line of code at a time.',
      yearbookQuote: 'It was never about the grades, it was about the 3 AM debugging sessions.',
    },
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
    update: {
      quote: 'Designing spaces that tell stories.',
      yearbookQuote: 'Architecting my own destiny.',
    },
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

  // Create Events
  const events = [
    {
      title: 'Freshers Party 2023',
      slug: 'freshers-party-2023',
      description: 'Where the journey began. Neon lights, loud music, and the first of many lifelong friendships.',
      chapterQuote: 'Everything started here.',
      chapterMood: 'EXCITED',
      featured: true,
      startDate: new Date('2023-09-15'),
    },
    {
      title: 'Sports Fest 2024',
      slug: 'sports-fest-2024',
      description: 'Victory, sweat, and team spirit. The roar of the crowd and the thrill of the game.',
      chapterQuote: 'Strength in unity.',
      chapterMood: 'ENERGETIC',
      featured: true,
      startDate: new Date('2024-03-20'),
    },
    {
      title: 'Farewell 2026',
      slug: 'farewell-2026',
      description: 'The final goodbye. Not just an end, but a new beginning.',
      chapterQuote: 'Till we meet again.',
      chapterMood: 'REFLECTIVE',
      featured: true,
      startDate: new Date('2026-05-10'),
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

    // Create Featured Media
    const media = await prisma.media.create({
      data: {
        eventId: event.id,
        type: MediaType.PHOTO,
        url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
        title: `${event.title} Highlight`,
        featured: true,
        importance: 10,
        participants: {
          connect: [{ id: rahul.id }, { id: priya.id }]
        },
        processingStatus: ProcessingStatus.COMPLETED
      }
    })

    // Set Highlights for Rahul
    if (event.slug === 'freshers-party-2023') {
       await prisma.person.update({
         where: { id: rahul.id },
         data: {
           favoriteMemoryId: media.id,
           signatureMomentMediaId: media.id,
           signatureMomentText: 'The moment we realized this was going to be the best four years.'
         }
       })
    }

    // Bidirectional Messages
    await prisma.message.create({
      data: {
        eventId: event.id,
        fromName: 'Priya Patel',
        fromPersonId: priya.id,
        targetId: rahul.id,
        content: `Rahul, remember when you lost your shoes at ${event.title}? Classic.`,
        category: 'funny'
      }
    })

    await prisma.message.create({
      data: {
        eventId: event.id,
        fromName: 'Rahul Sharma',
        fromPersonId: rahul.id,
        targetId: priya.id,
        content: `Thanks for keeping me sane during ${event.title}, Priya.`,
        category: 'thank-you'
      }
    })
  }

  console.log('Enhanced seed data completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

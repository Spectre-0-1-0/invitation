import { PrismaClient, MediaType, ProcessingStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding realistic scenarios...')

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

  const events = [
    {
      title: 'Freshers Party 2023',
      slug: 'freshers-party-2023',
      description: 'Where the journey began. Neon lights and new friendships.',
      chapterQuote: 'Everything started here.',
      chapterMood: 'Excited',
      featured: true
    },
    {
      title: 'Sports Fest 2024',
      slug: 'sports-fest-2024',
      description: 'Victory, sweat, and team spirit.',
      featured: true
    },
    {
      title: 'Hackathon 2025',
      slug: 'hackathon-2025',
      description: '48 hours of code, coffee, and pure innovation.',
      chapterQuote: 'Code is poetry.',
      featured: true
    },
    {
      title: 'Farewell 2026',
      slug: 'farewell-2026',
      description: 'The final goodbye. Not just an end, but a new beginning.',
      chapterQuote: 'Till we meet again.',
      featured: true
    }
  ]

  for (const eventData of events) {
    await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: {
        ...eventData,
        batchId: batch.id
      }
    })
  }

  console.log('Seeded realistic events.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

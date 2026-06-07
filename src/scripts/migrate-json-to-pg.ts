import { PrismaClient, MediaType, ProcessingStatus } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const DATA_DIR = path.join(process.cwd(), 'src/data')

async function main() {
  console.log('Starting migration...')

  // 1. Create a default Batch
  const batch = await prisma.batch.upsert({
    where: { id: 'default-batch' },
    update: {},
    create: {
      id: 'default-batch',
      name: 'Batch 2026',
      graduationYear: 2026,
      description: 'The inaugural batch for the Memory Archive'
    }
  })

  // 2. Create a default Event
  const event = await prisma.event.upsert({
    where: { slug: 'general-memories' },
    update: {},
    create: {
      id: 'default-event',
      batchId: batch.id,
      title: 'General Memories',
      slug: 'general-memories',
      description: 'A collection of miscellaneous memories from the batch'
    }
  })

  // 3. Migrate Seniors to Persons
  const seniors = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'seniors.json'), 'utf-8'))
  for (const senior of seniors) {
    await prisma.person.upsert({
      where: { slug: senior.id },
      update: {},
      create: {
        id: senior.id, // Using the existing ID as ID for consistency
        batchId: batch.id,
        name: senior.name,
        slug: senior.id,
        major: senior.major,
        quote: senior.quote,
        image: senior.image,
        socialLinks: senior.socialLinks || {}
      }
    })
  }
  console.log(`Migrated ${seniors.length} seniors.`)

  // 4. Migrate Memories to Media
  const memories = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'memories.json'), 'utf-8'))
  for (const memory of memories) {
    const mediaTypeMap: Record<string, MediaType> = {
      'photo': MediaType.PHOTO,
      'video': MediaType.VIDEO,
      'text': MediaType.DOCUMENT // Mapping text memories to DOCUMENT for now
    }

    await prisma.media.create({
      data: {
        id: memory.id,
        eventId: event.id,
        type: mediaTypeMap[memory.type] || MediaType.PHOTO,
        category: memory.category,
        title: memory.title,
        description: memory.description,
        url: memory.url,
        thumbnailUrl: memory.thumbnail,
        date: new Date(memory.date),
        featured: memory.featured || false,
        processingStatus: ProcessingStatus.COMPLETED,
        // Using peopleInvolved or taggedSeniors
        participants: {
          connect: (memory.peopleInvolved || memory.taggedSeniors || []).map((id: string) => ({ id }))
        }
      }
    })
  }
  console.log(`Migrated ${memories.length} memories.`)

  // 5. Migrate Timeline Events
  const timelineEvents = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'timeline.json'), 'utf-8'))
  for (const tEvent of timelineEvents) {
    // Creating separate events for major timeline items if they don't exist
    await prisma.event.upsert({
      where: { slug: tEvent.id },
      update: {},
      create: {
        id: tEvent.id,
        batchId: batch.id,
        title: tEvent.milestone || tEvent.title,
        slug: tEvent.id,
        description: tEvent.description,
        academicYear: tEvent.period,
        featured: tEvent.importance === 'major'
      }
    })
  }
  console.log(`Migrated ${timelineEvents.length} timeline events.`)

  // 6. Migrate Messages
  const messages = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'messages.json'), 'utf-8'))
  for (const msg of messages) {
    await prisma.message.create({
      data: {
        id: msg.id,
        fromName: msg.from,
        targetId: msg.targetId,
        content: msg.content,
        category: msg.category,
        relationship: msg.relationship,
        timestamp: new Date(msg.timestamp)
      }
    })
  }
  console.log(`Migrated ${messages.length} messages.`)

  // 7. Migrate Memes
  const memes = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'memes.json'), 'utf-8'))
  for (const meme of memes) {
    await prisma.meme.create({
      data: {
        id: meme.id,
        url: meme.url,
        caption: meme.caption,
        originContext: meme.originContext
      }
    })
  }
  console.log(`Migrated ${memes.length} memes.`)

  // 8. Migrate Achievements
  const achievements = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'achievements.json'), 'utf-8'))
  for (const ach of achievements) {
    await prisma.achievement.create({
      data: {
        id: ach.id,
        personId: ach.recipientId,
        title: ach.title,
        description: ach.description,
        date: new Date(ach.date),
        category: ach.category
      }
    })
  }
  console.log(`Migrated ${achievements.length} achievements.`)

  console.log('Migration completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
// To allow running with ts-node/npx if needed, but we already have the logic.

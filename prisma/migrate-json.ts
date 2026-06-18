import { PrismaClient, MediaType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration from JSON to Database...');

  // 1. Create a default Batch
  const batch = await prisma.batch.upsert({
    where: { name: 'Class of 2025' },
    update: {},
    create: { name: 'Class of 2025' },
  });
  console.log(`Created/Found Batch: ${batch.name}`);

  // 2. Migrate People (Seniors)
  const seniorsPath = path.join(process.cwd(), 'src/data/seniors.json');
  if (fs.existsSync(seniorsPath)) {
    const seniors = JSON.parse(fs.readFileSync(seniorsPath, 'utf8'));
    for (const s of seniors) {
      await prisma.person.upsert({
        where: { slug: s.id },
        update: {},
        create: {
          slug: s.id,
          name: s.name,
          nickname: s.nickname,
          major: s.major,
          graduationYear: s.graduationYear,
          yearbookQuote: s.quote,
          image: s.image,
          batchId: batch.id
        }
      });
    }
    console.log(`Migrated ${seniors.length} people.`);
  }

  // 3. Migrate Events (Albums/Timeline)
  const albumToMemoryMap = new Map<string, string>(); // memoryId -> eventId
  const albumsPath = path.join(process.cwd(), 'src/data/albums.json');
  if (fs.existsSync(albumsPath)) {
    const albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
    for (const a of albums) {
      const event = await prisma.event.upsert({
        where: { slug: a.id },
        update: {},
        create: {
          slug: a.id,
          title: a.title,
          description: a.description,
          batchId: batch.id
        }
      });
      if (a.memoryIds) {
        a.memoryIds.forEach((mId: string) => albumToMemoryMap.set(mId, event.id));
      }
    }
    console.log(`Migrated ${albums.length} events (from albums).`);
  }

  // 4. Migrate Media
  const memoriesPath = path.join(process.cwd(), 'src/data/memories.json');
  if (fs.existsSync(memoriesPath)) {
    const memories = JSON.parse(fs.readFileSync(memoriesPath, 'utf8'));

    // Ensure we have a general event for memories without a specific album
    const generalEvent = await prisma.event.upsert({
      where: { slug: 'general-memories' },
      update: {},
      create: {
        slug: 'general-memories',
        title: 'General Memories',
        batchId: batch.id
      },
    });

    for (const m of memories) {
      const eventId = albumToMemoryMap.get(m.id) || generalEvent.id;

      await prisma.media.create({
        data: {
          url: m.url,
          thumbnailUrl: m.thumbnail,
          type: (m.type === 'video' ? 'VIDEO' : 'PHOTO') as MediaType,
          category: m.category,
          title: m.title,
          description: m.description,
          featured: m.featured || false,
          eventId: eventId,
          taggedPeople: m.peopleInvolved ? {
            connect: m.peopleInvolved.map((slug: string) => ({ slug }))
          } : undefined
        }
      });
    }
    console.log(`Migrated ${memories.length} media items.`);
  }

  // 5. Migrate Messages
  const messagesPath = path.join(process.cwd(), 'src/data/messages.json');
  if (fs.existsSync(messagesPath)) {
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    for (const m of messages) {
      await prisma.message.create({
        data: {
          from: m.from,
          content: m.content,
          category: m.category,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        }
      });
    }
    console.log(`Migrated ${messages.length} messages.`);
  }

  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

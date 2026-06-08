import { prisma } from '../prisma/client';
import seniors from '../../data/seniors.json';
import memories from '../../data/memories.json';
import timeline from '../../data/timeline.json';
import messages from '../../data/messages.json';
import achievements from '../../data/achievements.json';
import memes from '../../data/memes.json';

async function main() {
  console.log('Starting migration...');

  // 1. Create Batch
  const batch = await prisma.batch.upsert({
    where: { id: 'class-of-2025' },
    update: {},
    create: {
      id: 'class-of-2025',
      name: 'Class of 2025',
      year: 2025,
    },
  });

  console.log('Batch created');

  // 2. Migrate People (Seniors)
  for (const senior of seniors) {
    await prisma.person.upsert({
      where: { slug: senior.id },
      update: {},
      create: {
        slug: senior.id,
        name: senior.name,
        nickname: (senior as any).nickname,
        major: senior.major,
        branch: (senior as any).branch,
        graduationYear: senior.graduationYear,
        quote: senior.quote,
        image: senior.image,
        socialLinks: (senior as any).socialLinks || {},
        batchId: batch.id,
      },
    });
  }
  console.log('People migrated');

  // 3. Migrate Events (Timeline)
  for (const item of timeline) {
    await prisma.event.upsert({
      where: { slug: item.id },
      update: {},
      create: {
        slug: item.id,
        title: item.milestone,
        description: item.description,
        date: new Date(item.period),
        type: 'milestone',
        importance: item.importance,
        batchId: batch.id,
      },
    });
  }
  console.log('Events migrated');

  // 4. Migrate Media (Memories)
  for (const memory of memories) {
    await prisma.media.create({
      data: {
        id: memory.id,
        type: memory.type,
        category: (memory as any).category,
        url: memory.url,
        thumbnailUrl: (memory as any).thumbnail,
        title: memory.title,
        description: memory.description,
        date: new Date(memory.date),
        location: (memory as any).location,
        tags: memory.tags,
        featured: memory.featured,
        people: {
          connect: memory.peopleInvolved?.map(slug => ({ slug })) || [],
        },
      },
    });
  }
  console.log('Media migrated');

  // 5. Migrate Messages
  for (const msg of messages) {
    await prisma.message.create({
      data: {
        fromName: msg.from,
        content: msg.content,
        category: msg.category,
        relationship: (msg as any).relationship,
        toPerson: msg.targetId ? { connect: { slug: msg.targetId } } : undefined,
        createdAt: new Date(msg.timestamp),
      },
    });
  }
  console.log('Messages migrated');

  // 6. Migrate Achievements
  for (const ach of achievements) {
    await prisma.achievement.create({
      data: {
        title: ach.title,
        description: (ach as any).description,
        category: ach.category,
        date: new Date(ach.date),
        person: { connect: { slug: ach.recipientId } },
      },
    });
  }
  console.log('Achievements migrated');

  // 7. Migrate Memes
  for (const meme of memes) {
    await prisma.meme.create({
      data: {
        url: meme.url,
        caption: (meme as any).caption,
        originContext: meme.originContext,
      },
    });
  }
  console.log('Memes migrated');

  console.log('Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

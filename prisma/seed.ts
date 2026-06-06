import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: 'Freshers' }, update: {}, create: { name: 'Freshers' } }),
    prisma.tag.upsert({ where: { name: 'Engineering' }, update: {}, create: { name: 'Engineering' } }),
    prisma.tag.upsert({ where: { name: 'Sports' }, update: {}, create: { name: 'Sports' } }),
  ]);

  // Create People
  const alex = await prisma.person.create({
    data: {
      name: 'Alex Rivera',
      nickname: 'River',
      major: 'Architecture',
      batch: '2025-A',
      quote: 'We shape our buildings; thereafter they shape us.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop'
    }
  });

  const jane = await prisma.person.create({
    data: {
      name: 'Jane Doe',
      major: 'Computer Science',
      batch: '2025-B',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
    }
  });

  // Create Events
  const orientation = await prisma.event.create({
    data: {
      title: 'Orientation Day 2021',
      description: 'The beginning of our journey. Nervous faces and new beginnings.',
      date: new Date('2021-08-15'),
      academicYear: '2021-22',
      category: 'academic',
      location: 'Main Auditorium',
      importance: 5,
      chapterMood: 'nostalgic',
      people: { connect: [{ id: alex.id }, { id: jane.id }] },
      tags: { connect: [{ name: 'Engineering' }] }
    }
  });

  const freshers = await prisma.event.create({
    data: {
      title: 'Freshers Night: Neon Glow',
      description: 'The first big party. Music, lights, and meeting the rest of the batch.',
      date: new Date('2021-09-20'),
      academicYear: '2021-22',
      category: 'social',
      location: 'Open Grounds',
      importance: 4,
      chapterMood: 'energetic',
      people: { connect: [{ id: alex.id }, { id: jane.id }] },
      tags: { connect: [{ name: 'Freshers' }] }
    }
  });

  // Add Media to Orientation
  await prisma.mediaFile.create({
    data: {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
      type: 'image',
      mimeType: 'image/jpeg',
      size: 1024000,
      eventId: orientation.id,
      taggedPeople: { connect: [{ id: alex.id }] }
    }
  });

  // Add Memory to Freshers
  await prisma.memory.create({
    data: {
      title: 'The Unofficial Afterparty',
      description: 'Dosa at 2 AM after the party ended.',
      type: 'text',
      eventId: freshers.id,
      importance: 3,
      featured: true,
      people: { connect: [{ id: alex.id }, { id: jane.id }] }
    }
  });

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

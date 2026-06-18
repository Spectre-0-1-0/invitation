import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: 'Freshers' }, update: {}, create: { name: 'Freshers' } }),
    prisma.tag.upsert({ where: { name: 'Engineering' }, update: {}, create: { name: 'Engineering' } }),
    prisma.tag.upsert({ where: { name: 'Sports' }, update: {}, create: { name: 'Sports' } }),
    prisma.tag.upsert({ where: { name: 'Placement' }, update: {}, create: { name: 'Placement' } }),
  ]);

  // People
  const alex = await prisma.person.upsert({
    where: { id: 'alex-rivera' },
    update: {},
    create: {
      id: 'alex-rivera',
      name: 'Alex Rivera',
      nickname: 'River',
      major: 'Architecture',
      branch: 'B.Arch',
      batch: '2025-A',
      bio: 'Lover of urban design and late-night sketching.',
      favoriteMemory: 'The first time we saw our models displayed in the main hall.',
      quote: 'We shape our buildings; thereafter they shape us.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
      socialLinks: { instagram: 'arivera_arch', linkedin: 'alex-rivera-arch' },
      handwritingPersona: 'neat',
      signatureMoment: 'Winning the Dean’s Prize for Urban Sustainability.'
    }
  });

  const jane = await prisma.person.upsert({
    where: { id: 'jane-doe' },
    update: {},
    create: {
      id: 'jane-doe',
      name: 'Jane Doe',
      nickname: 'CodeQueen',
      major: 'Computer Science',
      branch: 'B.Tech CS',
      batch: '2025-B',
      bio: 'Logic-driven but memory-led.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      handwritingPersona: 'chaotic'
    }
  });

  const rahul = await prisma.person.upsert({
    where: { id: 'rahul-sharma' },
    update: {},
    create: {
      id: 'rahul-sharma',
      name: 'Rahul Sharma',
      nickname: 'The Captain',
      major: 'Mechanical Engineering',
      branch: 'B.Tech ME',
      batch: '2025-A',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      handwritingPersona: 'clown'
    }
  });

  // Relationships
  await prisma.relationship.upsert({
    where: { personId_targetId_type: { personId: alex.id, targetId: jane.id, type: 'friend' } },
    update: {},
    create: { personId: alex.id, targetId: jane.id, type: 'friend', context: 'Foundation Studio' }
  });

  await prisma.relationship.upsert({
    where: { personId_targetId_type: { personId: jane.id, targetId: rahul.id, type: 'roommate' } },
    update: {},
    create: { personId: jane.id, targetId: rahul.id, type: 'roommate', context: 'Hostel Block C' }
  });

  // Events
  const orientation = await prisma.event.upsert({
    where: { id: 'orientation-2021' },
    update: {},
    create: {
      id: 'orientation-2021',
      title: 'Orientation Day 2021',
      description: 'The beginning of our journey.',
      date: new Date('2021-08-15'),
      academicYear: '2021-22',
      category: 'academic',
      people: { connect: [{ id: alex.id }, { id: jane.id }, { id: rahul.id }] }
    }
  });

  // Achievements
  await prisma.achievement.create({
    data: {
      title: 'Dean’s List 2024',
      date: new Date('2024-05-20'),
      category: 'academic',
      personId: alex.id
    }
  });

  console.log('Sprint 3 seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const people = await prisma.person.findMany({
      include: {
        batch: { select: { name: true } },
        _count: { select: { events: true, taggedMedia: true } }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(people);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      nickname,
      major,
      graduationYear,
      yearbookQuote,
      batchId,
      image,
      featured,
      displayOrder
    } = body;

    if (!name || !slug || !batchId) {
      return NextResponse.json({ error: 'Name, slug, and batch are required' }, { status: 400 });
    }

    const person = await prisma.person.create({
      data: {
        name,
        slug,
        nickname,
        major,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        yearbookQuote,
        batchId,
        image,
        featured: featured || false,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0
      }
    });

    return NextResponse.json(person);
  } catch (error) {
    console.error('Failed to create person:', error);
    return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
  }
}

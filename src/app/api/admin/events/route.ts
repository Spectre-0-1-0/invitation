import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        batch: { select: { name: true } },
        _count: { select: { media: true, participants: true } }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, batchId, date, location, chapterQuote, featured } = body;

    if (!title || !slug || !batchId) {
      return NextResponse.json({ error: 'Title, slug, and batch are required' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        batchId,
        date: date ? new Date(date) : null,
        location,
        chapterQuote,
        featured: featured || false
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

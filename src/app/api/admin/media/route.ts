import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    const where = eventId ? { eventId } : {};

    const media = await prisma.media.findMany({
      where,
      include: {
        event: { select: { title: true } },
        taggedPeople: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      url,
      type,
      eventId,
      title,
      description,
      featured,
      isHiddenGem,
      taggedPeopleIds
    } = body;

    if (!url || !eventId) {
      return NextResponse.json({ error: 'URL and Event ID are required' }, { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        url,
        type: type || 'PHOTO',
        eventId,
        title,
        description,
        featured: featured || false,
        isHiddenGem: isHiddenGem || false,
        taggedPeople: taggedPeopleIds ? {
          connect: taggedPeopleIds.map((id: string) => ({ id }))
        } : undefined
      }
    });

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create media record' }, { status: 500 });
  }
}

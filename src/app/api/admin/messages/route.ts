import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        event: { select: { title: true } },
        person: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, content, category, eventId, personId } = body;

    if (!from || !content) {
      return NextResponse.json({ error: 'From and content are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: { from, content, category, eventId, personId }
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

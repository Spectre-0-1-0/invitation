import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { eventId, totalFiles } = await request.json();

    const upload = await prisma.upload.create({
      data: {
        eventId,
        totalFiles,
        status: 'QUEUED',
      },
    });

    return NextResponse.json({ uploadId: upload.id });
  } catch (error: any) {
    console.error('Failed to create upload batch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

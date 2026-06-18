import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { eventId, totalFiles, uploadedBy } = await request.json();

    const session = await prisma.uploadSession.create({
      data: {
        eventId,
        fileCount: totalFiles,
        uploadedBy,
        status: 'QUEUED',
        startedAt: new Date(),
      },
    });

    return NextResponse.json({ uploadId: session.id });
  } catch (error: any) {
    console.error('Failed to create upload session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

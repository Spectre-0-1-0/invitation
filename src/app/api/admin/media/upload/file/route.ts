import { NextResponse } from 'next/server';
import { storageService, MediaCategory } from '@/lib/storage/StorageService';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as MediaCategory) || 'gallery';
    const eventId = formData.get('eventId') as string;
    const uploadId = formData.get('uploadId') as string; // uploadSessionId
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Basic validation
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'application/pdf', 'application/zip', 'application/x-zip-compressed'
    ];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.zip')) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await storageService.uploadMedia(
      buffer,
      file.name,
      category,
      eventId
    );

    // If eventId is provided, create a Media record automatically
    let mediaRecord = null;
    if (eventId) {
      mediaRecord = await prisma.media.create({
        data: {
          url: fileUrl,
          type: file.type.startsWith('video') ? 'VIDEO' : (file.type.includes('pdf') ? 'DOCUMENT' : 'PHOTO'),
          category: category,
          title: title || file.name,
          description: description,
          eventId: eventId,
          uploadSessionId: uploadId || undefined,
        },
      });

      // Update upload session progress if applicable
      if (uploadId) {
        await prisma.uploadSession.update({
          where: { id: uploadId },
          data: {
            successCount: { increment: 1 },
            status: 'PROCESSING' // Or keep as is
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      media: mediaRecord,
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

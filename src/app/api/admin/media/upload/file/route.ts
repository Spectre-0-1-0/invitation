import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadFile, getBucketFromMimeType } from '@/lib/supabase-storage';
import { inngest } from '@/inngest/client';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const eventId = formData.get('eventId') as string;
    const uploadId = formData.get('uploadId') as string;
    const isZip = formData.get('isZip') === 'true';

    if (!file || !eventId) {
      return NextResponse.json({ error: 'Missing file or eventId' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Duplication Prevention: Checksum
    const checksum = crypto.createHash('md5').update(buffer).digest('hex');
    const existing = await prisma.media.findFirst({
      where: { checksum, eventId }
    });

    if (existing && !isZip) {
      return NextResponse.json({
        status: 'duplicate',
        url: existing.url,
        mediaId: existing.id,
        message: 'File already exists in this event.'
      });
    }

    const mimeType = file.type || 'application/octet-stream';
    const bucket = getBucketFromMimeType(mimeType, file.name);

    const path = `uploads/${uploadId || 'direct'}/${Date.now()}-${file.name}`;
    const publicUrl = await uploadFile(buffer, bucket, path, mimeType);

    if (isZip) {
      await inngest.send({
        name: 'media/zip.uploaded',
        data: {
          uploadId,
          zipUrl: publicUrl,
          eventId
        }
      });

      return NextResponse.json({ status: 'processing_zip', url: publicUrl });
    } else {
      const media = await prisma.media.create({
        data: {
          url: publicUrl,
          type: bucket.toUpperCase().replace(/S$/, '') as any,
          originalName: file.name,
          mimeType,
          eventId,
          uploadId: uploadId || null,
          status: 'QUEUED',
          checksum
        }
      });

      await inngest.send({
        name: 'media/upload.created',
        data: {
          mediaId: media.id
        }
      });

      return NextResponse.json({ status: 'queued', url: publicUrl, mediaId: media.id });
    }
  } catch (error: any) {
    console.error('File upload failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

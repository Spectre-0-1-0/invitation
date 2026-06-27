import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { storageService } from '@/lib/storage/StorageService';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { taggedPeopleIds, ...rest } = body;

    const media = await prisma.media.update({
      where: { id },
      data: {
        ...rest,
        taggedPeople: taggedPeopleIds ? {
          set: taggedPeopleIds.map((id: string) => ({ id }))
        } : undefined
      }
    });

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Find the media to get its URL
    const media = await prisma.media.findUnique({
      where: { id }
    });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // 2. Delete from storage
    try {
      await storageService.deleteMedia(media.url);
      // Also delete thumbnail if it exists
      if (media.thumbnailUrl) {
        await storageService.deleteMedia(media.thumbnailUrl);
      }
    } catch (storageError) {
      console.error('Failed to delete file from storage:', storageError);
      // We continue to delete the DB record even if storage fails
      // to avoid stuck records, but we log it.
    }

    // 3. Delete from database
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Media Error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

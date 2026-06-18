import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { action, mediaIds, data } = await request.json();

    if (!mediaIds || !Array.isArray(mediaIds)) {
      return NextResponse.json({ error: 'Missing mediaIds' }, { status: 400 });
    }

    switch (action) {
      case 'TAG':
        await prisma.media.updateMany({
          where: { id: { in: mediaIds } },
          data: {} // Prisma updateMany doesn't support many-to-many directly
        });
        // We need a loop for tagging because of the relationship
        for (const id of mediaIds) {
          await prisma.media.update({
            where: { id },
            data: {
              taggedPeople: {
                connect: data.peopleIds.map((pid: string) => ({ id: pid }))
              }
            }
          });
        }
        break;

      case 'EVENT':
        await prisma.media.updateMany({
          where: { id: { in: mediaIds } },
          data: { eventId: data.eventId }
        });
        break;

      case 'FEATURE':
        await prisma.media.updateMany({
          where: { id: { in: mediaIds } },
          data: { featured: data.featured }
        });
        break;

      case 'GEM':
        await prisma.media.updateMany({
          where: { id: { in: mediaIds } },
          data: { isHiddenGem: data.isHiddenGem }
        });
        break;

      case 'DELETE':
        await prisma.media.deleteMany({
          where: { id: { in: mediaIds } }
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Bulk operation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

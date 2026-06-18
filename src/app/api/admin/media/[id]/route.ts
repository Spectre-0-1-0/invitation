import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    await prisma.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

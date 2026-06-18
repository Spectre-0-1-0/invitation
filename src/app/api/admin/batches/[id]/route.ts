import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        _count: {
          select: { events: true, people: true }
        }
      }
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json(batch);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch batch' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, isArchived } = body;

    const batch = await prisma.batch.update({
      where: { id },
      data: { name, isArchived }
    });

    return NextResponse.json(batch);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update batch' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        _count: {
          select: { events: true, people: true }
        }
      }
    });

    if (batch?._count.events || batch?._count.people) {
      return NextResponse.json({
        error: 'Cannot delete batch with existing events or people. Archive it instead.'
      }, { status: 400 });
    }

    await prisma.batch.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete batch' }, { status: 500 });
  }
}

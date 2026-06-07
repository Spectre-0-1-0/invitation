import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const batch = await prisma.batch.update({
      where: { id },
      data: body
    })
    return NextResponse.json(batch)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.batch.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      events: { include: { _count: { select: { media: true } } } },
      people: true,
      _count: { select: { events: true, people: true } }
    }
  })

  if (!batch) return NextResponse.json({ error: 'Batch not found' }, { status: 404 })

  // Calculate statistics
  const mediaCount = await prisma.media.count({
    where: { event: { batchId: id } }
  })

  return NextResponse.json({ ...batch, statistics: { totalMedia: mediaCount } })
}

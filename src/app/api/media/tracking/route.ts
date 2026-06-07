import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  const status = searchParams.get('status')

  const where: any = {}
  if (eventId) where.eventId = eventId
  if (status) where.processingStatus = status

  const media = await prisma.media.findMany({
    where,
    include: {
      event: {
        select: { title: true }
      },
      participants: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(media)
}

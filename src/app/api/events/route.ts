import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      batchId,
      title,
      slug,
      description,
      shortDescription,
      eventType,
      startDate,
      endDate,
      academicYear,
      location,
      tags
    } = body

    const event = await prisma.event.create({
      data: {
        batchId,
        title,
        slug,
        description,
        shortDescription,
        eventType,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        academicYear,
        location,
        tags: tags || []
      }
    })

    return NextResponse.json(event)
  } catch (error: any) {
    console.error('Event creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  const events = await prisma.event.findMany({
    include: { batch: true },
    orderBy: { startDate: 'desc' }
  })
  return NextResponse.json(events)
}

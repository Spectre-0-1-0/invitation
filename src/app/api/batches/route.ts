import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, graduationYear } = body

    const batch = await prisma.batch.create({
      data: {
        name,
        description,
        graduationYear
      }
    })

    return NextResponse.json(batch)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  const batches = await prisma.batch.findMany({
    include: {
      events: true,
      _count: {
        select: { events: true, people: true }
      }
    },
    orderBy: { graduationYear: 'desc' }
  })
  return NextResponse.json(batches)
}

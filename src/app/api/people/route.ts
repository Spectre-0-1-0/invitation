import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const person = await prisma.person.create({
      data: body
    })
    return NextResponse.json(person)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  const people = await prisma.person.findMany({
    include: { batch: true },
    orderBy: { name: 'asc' }
  })
  return NextResponse.json(people)
}

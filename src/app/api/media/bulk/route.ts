import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { mediaIds, data } = body

    if (!mediaIds || !Array.isArray(mediaIds)) {
      return NextResponse.json({ error: 'mediaIds array is required' }, { status: 400 })
    }

    const { participants, tags, ...otherData } = data

    const updatePromises = mediaIds.map(id => {
      const updateData: any = { ...otherData }

      if (participants) {
        updateData.participants = {
          set: participants.map((pId: string) => ({ id: pId }))
        }
      }

      // Note: Tags logic depends on how you want to handle them.
      // For simplicity, we overwrite them here.
      if (tags) {
        updateData.tags = tags
      }

      return prisma.media.update({
        where: { id },
        data: updateData
      })
    })

    const results = await Promise.all(updatePromises)

    return NextResponse.json({ success: true, count: results.length })
  } catch (error: any) {
    console.error('Bulk update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { mediaIds } = await request.json()

    if (!mediaIds || !Array.isArray(mediaIds)) {
      return NextResponse.json({ error: 'mediaIds array is required' }, { status: 400 })
    }

    const result = await prisma.media.deleteMany({
      where: {
        id: { in: mediaIds }
      }
    })

    return NextResponse.json({ success: true, count: result.count })
  } catch (error: any) {
    console.error('Bulk delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Support for assigning people to events at a high level
export async function POST(request: Request) {
  try {
    const { eventId, personIds } = await request.json()

    // For now, this is a placeholder for higher-level Event <-> Person association
    // In our current schema, we use taggedInMedia for association.
    // We could add an explicit EventParticipant model if needed later.

    return NextResponse.json({ success: true, count: personIds.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

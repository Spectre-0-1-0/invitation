import { NextResponse } from 'next/server'
import { uploadFile, BUCKETS } from '@/lib/storage/supabase-storage'
import { inngest } from '@/lib/inngest/client'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const eventId = formData.get('eventId') as string
    const file = formData.get('file') as File

    if (!eventId || !file) {
      return NextResponse.json({ error: 'eventId and file are required' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const storagePath = `zips/${eventId}/${Date.now()}-${file.name}`

    const { publicUrl, path: uploadedPath } = await uploadFile(buffer, storagePath, BUCKETS.GENERAL, file.type)

    await inngest.send({
      name: 'media/zip-uploaded',
      data: {
        zipPath: uploadedPath,
        bucket: BUCKETS.GENERAL,
        eventId: eventId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'ZIP upload received and processing started',
      zipUrl: publicUrl
    })
  } catch (error: any) {
    console.error('ZIP Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

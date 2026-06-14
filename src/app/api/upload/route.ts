import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { uploadFile, getBucketFromMediaType, BUCKETS } from '@/lib/storage/supabase-storage'
import { inngest } from '@/lib/inngest/client'
import { MediaType } from '@prisma/client'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const eventId = formData.get('eventId') as string
    const files = formData.getAll('files') as File[]
    const folderPath = formData.get('folderPath') as string || ''

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 })
    }

    const uploadedMedia = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = path.extname(file.name).toLowerCase()

      let type: MediaType = MediaType.PHOTO
      if (['.mp4', '.mov', '.avi'].includes(ext)) type = MediaType.VIDEO
      else if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) type = MediaType.DOCUMENT

      const bucket = getBucketFromMediaType(type)
      const storagePath = `events/${eventId}/${Date.now()}-${file.name}`

      const { publicUrl } = await uploadFile(buffer, storagePath, bucket, file.type)

      const media = await prisma.media.create({
        data: {
          eventId,
          type,
          url: publicUrl,
          title: file.name,
          fileSize: file.size,
          mimeType: file.type,
          folderPath: folderPath,
          processingStatus: 'PENDING'
        }
      })

      // Trigger background processing
      await inngest.send({
        name: 'media/uploaded',
        data: {
          mediaId: media.id,
          bucket,
          path: storagePath
        }
      })

      uploadedMedia.push(media)
    }

    return NextResponse.json({ success: true, count: uploadedMedia.length, media: uploadedMedia })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

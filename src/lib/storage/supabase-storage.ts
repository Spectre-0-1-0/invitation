import { supabase } from '../supabase'
import { MediaType } from '@prisma/client'

export const BUCKETS = {
  PHOTOS: 'photos',
  VIDEOS: 'videos',
  DOCUMENTS: 'documents',
  POSTERS: 'posters',
  MEMES: 'memes',
  GENERAL: 'general'
}

export function getBucketFromMediaType(type: MediaType): string {
  switch (type) {
    case MediaType.PHOTO:
      return BUCKETS.PHOTOS
    case MediaType.VIDEO:
      return BUCKETS.VIDEOS
    case MediaType.DOCUMENT:
      return BUCKETS.DOCUMENTS
    case MediaType.POSTER:
      return BUCKETS.POSTERS
    case MediaType.MEME:
      return BUCKETS.MEMES
    default:
      return BUCKETS.GENERAL
  }
}

export async function uploadFile(
  file: Buffer | Blob,
  path: string,
  bucket: string,
  contentType?: string
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return { path: data.path, publicUrl }
}

export async function deleteFile(path: string, bucket: string) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}

export async function downloadFile(path: string, bucket: string) {
  const { data, error } = await supabase.storage.from(bucket).download(path)
  if (error) throw error
  return data
}

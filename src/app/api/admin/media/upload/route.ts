import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Mock upload for now - in production this would use Supabase storage
  // but since we don't have credentials yet, we simulate it.
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Simulate a delay and return a mock URL
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUrl = `/content/gallery/${file.name}`;

    return NextResponse.json({
      url: mockUrl,
      name: file.name,
      type: file.type.startsWith('video') ? 'VIDEO' : 'PHOTO'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

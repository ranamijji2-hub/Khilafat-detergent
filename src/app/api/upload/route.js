import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPG, PNG, WEBP or GIF.' },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB).' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary — no local filesystem writes needed on Vercel
    const result = await uploadToCloudinary(buffer, {
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-')}`,
    });

    const media = await prisma.mediaFile.create({
      data: {
        filename: file.name,
        url: result.secure_url,
        cloudinaryId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });

    return NextResponse.json({ url: result.secure_url, media }, { status: 201 });
  } catch (err) {
    console.error('[upload] Error:', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const files = await prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ files });
}

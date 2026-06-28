import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function DELETE(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const media = await prisma.mediaFile.findUnique({ where: { id: Number(params.id) } });
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete from Cloudinary if we have the public_id
    if (media.cloudinaryId) {
      await deleteFromCloudinary(media.cloudinaryId).catch((e) =>
        console.error('[upload] Cloudinary delete failed:', e.message)
      );
    }

    await prisma.mediaFile.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error('[upload/delete]', err);
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 });
  }
}

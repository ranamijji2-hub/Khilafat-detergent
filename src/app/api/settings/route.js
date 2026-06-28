import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getSettings, updateSettings } from '@/lib/settings';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const settings = await updateSettings(body);
  return NextResponse.json({ settings });
}

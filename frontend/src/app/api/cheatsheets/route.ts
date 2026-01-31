import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheatsheet } from '@/lib/directus-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Get Directus access token from session or use static token for now
    const accessToken = process.env.DIRECTUS_STATIC_TOKEN || '';

    const result = await createCheatsheet(accessToken, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to create cheatsheet:', error);
    return NextResponse.json(
      { error: 'Failed to create cheatsheet' },
      { status: 500 }
    );
  }
}

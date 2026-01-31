import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMyCheatsheets } from '@/lib/directus-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Directus access token from session or use static token for now
    const accessToken = process.env.DIRECTUS_STATIC_TOKEN || '';

    const cheatsheets = await getMyCheatsheets(accessToken);
    return NextResponse.json(cheatsheets);
  } catch (error) {
    console.error('Failed to fetch cheatsheets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cheatsheets' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateCheatsheet, deleteCheatsheet, createAuthenticatedClient } from '@/lib/directus-auth';
import { readItem } from '@directus/sdk';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const accessToken = process.env.DIRECTUS_STATIC_TOKEN || '';
    const client = createAuthenticatedClient(accessToken);

    const cheatsheet = await client.request(
      readItem('cheatsheets', id, {
        fields: [
          '*',
          { category: ['id', 'name', 'slug'] },
          { tags: [{ tags_id: ['id', 'name', 'slug', 'color'] }] },
        ],
      })
    );

    return NextResponse.json(cheatsheet);
  } catch (error) {
    console.error('Failed to fetch cheatsheet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cheatsheet' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const data = await request.json();
    const accessToken = process.env.DIRECTUS_STATIC_TOKEN || '';

    const result = await updateCheatsheet(accessToken, id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to update cheatsheet:', error);
    return NextResponse.json(
      { error: 'Failed to update cheatsheet' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const accessToken = process.env.DIRECTUS_STATIC_TOKEN || '';

    await deleteCheatsheet(accessToken, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete cheatsheet:', error);
    return NextResponse.json(
      { error: 'Failed to delete cheatsheet' },
      { status: 500 }
    );
  }
}

import { createDirectus, rest, authentication, createItem, updateItem, deleteItem, readItems } from '@directus/sdk';
import type { DirectusSchema, Cheatsheet } from '@/types';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export function createAuthenticatedClient(accessToken?: string) {
  const client = createDirectus<DirectusSchema>(directusUrl)
    .with(rest())
    .with(authentication());

  if (accessToken) {
    client.setToken(accessToken);
  }

  return client;
}

export async function createCheatsheet(
  accessToken: string,
  data: Partial<Cheatsheet>
) {
  const client = createAuthenticatedClient(accessToken);
  return client.request(createItem('cheatsheets', data));
}

export async function updateCheatsheet(
  accessToken: string,
  id: string,
  data: Partial<Cheatsheet>
) {
  const client = createAuthenticatedClient(accessToken);
  return client.request(updateItem('cheatsheets', id, data));
}

export async function deleteCheatsheet(accessToken: string, id: string) {
  const client = createAuthenticatedClient(accessToken);
  return client.request(deleteItem('cheatsheets', id));
}

export async function getMyCheatsheets(accessToken: string) {
  const client = createAuthenticatedClient(accessToken);
  return client.request(
    readItems('cheatsheets', {
      fields: [
        'id',
        'slug',
        'title',
        'summary',
        'status',
        'date_created',
        'date_updated',
        { category: ['id', 'name', 'slug'] },
      ],
      sort: ['-date_updated'],
    })
  ) as Promise<Cheatsheet[]>;
}

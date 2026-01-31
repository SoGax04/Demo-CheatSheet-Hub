import { createDirectus, rest, readItems, readItem } from '@directus/sdk';
import type { DirectusSchema, Cheatsheet, Category, Tag } from '@/types';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const directus = createDirectus<DirectusSchema>(directusUrl).with(rest());

export async function getCheatsheets(options?: {
  status?: string;
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Cheatsheet[]> {
  try {
    const filter: Record<string, unknown> = {};

    if (options?.status) {
      filter.status = { _eq: options.status };
    } else {
      filter.status = { _eq: 'published' };
    }

    if (options?.category) {
      filter.category = {
        slug: { _eq: options.category }
      };
    }

    if (options?.tag) {
      filter.tags = {
        tags_id: {
          slug: { _eq: options.tag }
        }
      };
    }

    if (options?.search) {
      filter._or = [
        { title: { _icontains: options.search } },
        { body: { _icontains: options.search } },
        { summary: { _icontains: options.search } }
      ];
    }

    const result = await directus.request(
      readItems('cheatsheets', {
        filter,
        fields: [
          'id',
          'slug',
          'title',
          'summary',
          'status',
          'target_name',
          'target_version',
          'difficulty',
          'date_created',
          'date_updated',
          { category: ['id', 'name', 'slug', 'icon'] },
          { tags: [{ tags_id: ['id', 'name', 'slug', 'color'] }] }
        ],
        sort: ['-date_created'],
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0
      })
    );

    return result as Cheatsheet[];
  } catch (error) {
    console.error('Failed to fetch cheatsheets:', error);
    return [];
  }
}

export async function getCheatsheetBySlug(slug: string): Promise<Cheatsheet | null> {
  try {
    const result = await directus.request(
      readItems('cheatsheets', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        fields: [
          '*',
          { category: ['id', 'name', 'slug', 'icon'] },
          { tags: [{ tags_id: ['id', 'name', 'slug', 'color'] }] },
          { related_cheatsheets: [{ related_cheatsheets_id: ['id', 'slug', 'title', 'summary', 'difficulty'] }] }
        ],
        limit: 1
      })
    );

    return (result as Cheatsheet[])[0] || null;
  } catch (error) {
    console.error('Failed to fetch cheatsheet:', error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await directus.request(
      readItems('categories', {
        fields: ['id', 'name', 'slug', 'description', 'icon', 'sort'],
        sort: ['sort', 'name']
      })
    );

    return result as Category[];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const result = await directus.request(
      readItems('categories', {
        filter: { slug: { _eq: slug } },
        fields: ['id', 'name', 'slug', 'description', 'icon'],
        limit: 1
      })
    );

    return (result as Category[])[0] || null;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    const result = await directus.request(
      readItems('tags', {
        fields: ['id', 'name', 'slug', 'color'],
        sort: ['name']
      })
    );

    return result as Tag[];
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const result = await directus.request(
      readItems('tags', {
        filter: { slug: { _eq: slug } },
        fields: ['id', 'name', 'slug', 'color'],
        limit: 1
      })
    );

    return (result as Tag[])[0] || null;
  } catch (error) {
    console.error('Failed to fetch tag:', error);
    return null;
  }
}

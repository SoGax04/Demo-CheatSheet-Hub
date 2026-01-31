import { getCheatsheets, getCategories, getTags } from '@/lib/directus';
import CheatsheetCard from '@/components/CheatsheetCard';
import CategoryList from '@/components/CategoryList';
import TagList from '@/components/TagList';
import type { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} | CheatSheet Hub` : 'Search | CheatSheet Hub',
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const [cheatsheets, categories, tags] = await Promise.all([
    query ? getCheatsheets({ search: query, limit: 50 }) : Promise.resolve([]),
    getCategories(),
    getTags(),
  ]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0 space-y-6">
        <CategoryList categories={categories} />
        <TagList tags={tags} />
      </aside>

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Search Results</h1>
          {query && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Results for: <span className="font-medium">&quot;{query}&quot;</span>
            </p>
          )}
        </div>

        {!query ? (
          <p className="text-gray-500 dark:text-gray-400">
            Enter a search term to find cheatsheets.
          </p>
        ) : cheatsheets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No cheatsheets found matching &quot;{query}&quot;.
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Found {cheatsheets.length} cheatsheet{cheatsheets.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {cheatsheets.map((cheatsheet) => (
                <CheatsheetCard key={cheatsheet.id} cheatsheet={cheatsheet} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

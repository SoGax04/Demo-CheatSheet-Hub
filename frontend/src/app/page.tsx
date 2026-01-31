import { getCheatsheets, getCategories, getTags } from '@/lib/directus';
import CheatsheetCard from '@/components/CheatsheetCard';
import CategoryList from '@/components/CategoryList';
import TagList from '@/components/TagList';

export const revalidate = 60;

export default async function HomePage() {
  const [cheatsheets, categories, tags] = await Promise.all([
    getCheatsheets({ limit: 20 }),
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
        <h1 className="text-2xl font-bold mb-6">Latest Cheatsheets</h1>

        {cheatsheets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No cheatsheets found.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cheatsheets.map((cheatsheet) => (
              <CheatsheetCard key={cheatsheet.id} cheatsheet={cheatsheet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { getCheatsheets, getCategoryBySlug, getCategories, getTags } from '@/lib/directus';
import CheatsheetCard from '@/components/CheatsheetCard';
import CategoryList from '@/components/CategoryList';
import TagList from '@/components/TagList';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Not Found' };
  }

  return {
    title: `${category.name} | CheatSheet Hub`,
    description: category.description || `Cheatsheets for ${category.name}`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, cheatsheets, categories, tags] = await Promise.all([
    getCategoryBySlug(slug),
    getCheatsheets({ category: slug, limit: 50 }),
    getCategories(),
    getTags(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0 space-y-6">
        <CategoryList categories={categories} activeSlug={slug} />
        <TagList tags={tags} />
      </aside>

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>

        {cheatsheets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No cheatsheets found in this category.
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

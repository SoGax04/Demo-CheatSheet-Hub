import { notFound } from 'next/navigation';
import { getCheatsheets, getTagBySlug, getCategories, getTags } from '@/lib/directus';
import CheatsheetCard from '@/components/CheatsheetCard';
import CategoryList from '@/components/CategoryList';
import TagList from '@/components/TagList';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: 'Not Found' };
  }

  return {
    title: `#${tag.name} | CheatSheet Hub`,
    description: `Cheatsheets tagged with ${tag.name}`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const [tag, cheatsheets, categories, tags] = await Promise.all([
    getTagBySlug(slug),
    getCheatsheets({ tag: slug, limit: 50 }),
    getCategories(),
    getTags(),
  ]);

  if (!tag) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-64 flex-shrink-0 space-y-6">
        <CategoryList categories={categories} />
        <TagList tags={tags} activeSlug={slug} />
      </aside>

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            <span
              className="px-3 py-1 rounded-full"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
                color: tag.color || '#374151',
              }}
            >
              #{tag.name}
            </span>
          </h1>
        </div>

        {cheatsheets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No cheatsheets found with this tag.
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

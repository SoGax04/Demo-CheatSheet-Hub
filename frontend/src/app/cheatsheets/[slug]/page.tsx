import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCheatsheetBySlug } from '@/lib/directus';
import MarkdownContent from '@/components/MarkdownContent';
import type { Category, Tag, CheatsheetTag, CheatsheetRelated, Cheatsheet, Reference } from '@/types';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cheatsheet = await getCheatsheetBySlug(slug);

  if (!cheatsheet) {
    return { title: 'Not Found' };
  }

  return {
    title: `${cheatsheet.title} | CheatSheet Hub`,
    description: cheatsheet.seo_description || cheatsheet.summary || undefined,
  };
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const difficultyLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default async function CheatsheetPage({ params }: PageProps) {
  const { slug } = await params;
  const cheatsheet = await getCheatsheetBySlug(slug);

  if (!cheatsheet) {
    notFound();
  }

  const category = cheatsheet.category as Category | null;
  const tags = cheatsheet.tags?.map((t: CheatsheetTag) => t.tags_id as Tag) || [];
  const relatedCheatsheets = cheatsheet.related_cheatsheets?.map(
    (r: CheatsheetRelated) => r.related_cheatsheets_id as Cheatsheet
  ) || [];
  const references = cheatsheet.references as Reference[] | null;

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded"
            >
              {category.icon && <span>{category.icon}</span>}
              {category.name}
            </Link>
          )}
          {cheatsheet.difficulty && (
            <span
              className={`px-3 py-1 text-sm font-medium rounded ${difficultyColors[cheatsheet.difficulty]}`}
            >
              {difficultyLabels[cheatsheet.difficulty]}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4">{cheatsheet.title}</h1>

        {cheatsheet.summary && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {cheatsheet.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {cheatsheet.target_name && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
              {cheatsheet.target_name}
              {cheatsheet.target_version && ` ${cheatsheet.target_version}`}
            </span>
          )}
          <time>
            Published: {new Date(cheatsheet.date_created).toLocaleDateString('ja-JP')}
          </time>
          {cheatsheet.date_updated && (
            <time>
              Updated: {new Date(cheatsheet.date_updated).toLocaleDateString('ja-JP')}
            </time>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-3 py-1 text-sm rounded-full"
                style={{
                  backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
                  color: tag.color || '#374151',
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        {cheatsheet.body ? (
          <MarkdownContent content={cheatsheet.body} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No content available.</p>
        )}
      </div>

      {references && references.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">References</h2>
          <ul className="space-y-2">
            {references.map((ref, index) => (
              <li key={index}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {ref.title || ref.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedCheatsheets.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Related Cheatsheets</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedCheatsheets.map((related) => (
              <Link
                key={related.id}
                href={`/cheatsheets/${related.slug}`}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-1">{related.title}</h3>
                {related.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {related.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

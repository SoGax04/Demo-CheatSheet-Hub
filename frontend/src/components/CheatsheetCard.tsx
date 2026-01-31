import Link from 'next/link';
import type { Cheatsheet, Category, Tag, CheatsheetTag } from '@/types';

interface CheatsheetCardProps {
  cheatsheet: Cheatsheet;
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

export default function CheatsheetCard({ cheatsheet }: CheatsheetCardProps) {
  const category = cheatsheet.category as Category | null;
  const tags = cheatsheet.tags?.map((t: CheatsheetTag) => t.tags_id as Tag) || [];

  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between gap-2 mb-3">
        <Link href={`/cheatsheets/${cheatsheet.slug}`}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
            {cheatsheet.title}
          </h2>
        </Link>
        {cheatsheet.difficulty && (
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded ${difficultyColors[cheatsheet.difficulty]}`}
          >
            {difficultyLabels[cheatsheet.difficulty]}
          </span>
        )}
      </div>

      {cheatsheet.summary && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {cheatsheet.summary}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {category && (
          <Link
            href={`/categories/${category.slug}`}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded"
          >
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </Link>
        )}
        {cheatsheet.target_name && (
          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
            {cheatsheet.target_name}
            {cheatsheet.target_version && ` ${cheatsheet.target_version}`}
          </span>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 5).map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="px-2 py-0.5 text-xs rounded-full"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
                color: tag.color || '#374151',
              }}
            >
              #{tag.name}
            </Link>
          ))}
          {tags.length > 5 && (
            <span className="px-2 py-0.5 text-xs text-gray-500">
              +{tags.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <time className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(cheatsheet.date_created).toLocaleDateString('ja-JP')}
        </time>
      </div>
    </article>
  );
}

import Link from 'next/link';
import type { Category } from '@/types';

interface CategoryListProps {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryList({ categories, activeSlug }: CategoryListProps) {
  return (
    <div className="space-y-1">
      <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        Categories
      </h3>
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/categories/${category.slug}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSlug === category.slug
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {category.icon && <span>{category.icon}</span>}
              <span>{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

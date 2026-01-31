import Link from 'next/link';
import type { Tag } from '@/types';

interface TagListProps {
  tags: Tag[];
  activeSlug?: string;
}

export default function TagList({ tags, activeSlug }: TagListProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeSlug === tag.slug
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
            style={{
              backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
              color: tag.color || '#374151',
            }}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

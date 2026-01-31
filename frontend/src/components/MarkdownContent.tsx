'use client';

import { ReactMarkdown, markdownPlugins, markdownComponents } from '@/lib/markdown';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={markdownPlugins.remarkPlugins}
        rehypePlugins={markdownPlugins.rehypePlugins}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

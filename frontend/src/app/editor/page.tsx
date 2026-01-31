'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Cheatsheet } from '@/types';

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cheatsheets, setCheatsheets] = useState<Cheatsheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchCheatsheets();
    }
  }, [session]);

  const fetchCheatsheets = async () => {
    try {
      const res = await fetch('/api/cheatsheets/my');
      if (res.ok) {
        const data = await res.json();
        setCheatsheets(data);
      }
    } catch (error) {
      console.error('Failed to fetch cheatsheets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Cheatsheets</h1>
        <Link
          href="/editor/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create New
        </Link>
      </div>

      {cheatsheets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven&apos;t created any cheatsheets yet.
          </p>
          <Link
            href="/editor/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Cheatsheet
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cheatsheets.map((cheatsheet) => (
            <div
              key={cheatsheet.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold">{cheatsheet.title}</h2>
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${statusColors[cheatsheet.status]}`}
                  >
                    {cheatsheet.status}
                  </span>
                </div>
                {cheatsheet.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {cheatsheet.summary}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Updated: {new Date(cheatsheet.date_updated || cheatsheet.date_created).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/editor/${cheatsheet.id}`}
                  className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Edit
                </Link>
                {cheatsheet.status === 'published' && (
                  <Link
                    href={`/cheatsheets/${cheatsheet.slug}`}
                    className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

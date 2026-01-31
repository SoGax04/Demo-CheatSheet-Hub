'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import type { Category, Tag, Cheatsheet } from '@/types';

export default function EditCheatsheetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    body: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    category: '',
    target_name: '',
    target_version: '',
    difficulty: '' as '' | 'beginner' | 'intermediate' | 'advanced',
    seo_description: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && id) {
      fetchData();
    }
  }, [session, id]);

  const fetchData = async () => {
    try {
      const [cheatsheetRes, catRes, tagRes] = await Promise.all([
        fetch(`/api/cheatsheets/${id}`),
        fetch('/api/categories'),
        fetch('/api/tags'),
      ]);

      if (catRes.ok) setCategories(await catRes.json());
      if (tagRes.ok) setTags(await tagRes.json());

      if (cheatsheetRes.ok) {
        const cheatsheet: Cheatsheet = await cheatsheetRes.json();
        setFormData({
          title: cheatsheet.title,
          slug: cheatsheet.slug,
          summary: cheatsheet.summary || '',
          body: cheatsheet.body || '',
          status: cheatsheet.status,
          category: typeof cheatsheet.category === 'object' && cheatsheet.category
            ? cheatsheet.category.id
            : (cheatsheet.category as string) || '',
          target_name: cheatsheet.target_name || '',
          target_version: cheatsheet.target_version || '',
          difficulty: cheatsheet.difficulty || '',
          seo_description: cheatsheet.seo_description || '',
        });
      } else {
        router.push('/editor');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/editor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, saveStatus: 'draft' | 'published' | 'archived') => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/cheatsheets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: saveStatus,
          category: formData.category || null,
          difficulty: formData.difficulty || null,
        }),
      });

      if (res.ok) {
        setFormData((prev) => ({ ...prev, status: saveStatus }));
        alert('Saved successfully!');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to save cheatsheet');
      }
    } catch (error) {
      console.error('Failed to save cheatsheet:', error);
      alert('Failed to save cheatsheet');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this cheatsheet?')) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/cheatsheets/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/editor');
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to delete cheatsheet');
      }
    } catch (error) {
      console.error('Failed to delete cheatsheet:', error);
      alert('Failed to delete cheatsheet');
    } finally {
      setSaving(false);
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Edit Cheatsheet</h1>
        <div className="flex items-center gap-4">
          {formData.status === 'published' && (
            <Link
              href={`/cheatsheets/${formData.slug}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
            >
              View Live
            </Link>
          )}
          <Link
            href="/editor"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Back to List
          </Link>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Target Name</label>
            <input
              type="text"
              value={formData.target_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, target_name: e.target.value }))}
              placeholder="e.g., Python, Git"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  difficulty: e.target.value as '' | 'beginner' | 'intermediate' | 'advanced',
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
          <MarkdownEditor
            value={formData.body}
            onChange={(value) => setFormData((prev) => ({ ...prev, body: value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">SEO Description</label>
          <textarea
            value={formData.seo_description}
            onChange={(e) => setFormData((prev) => ({ ...prev, seo_description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50"
          >
            Delete
          </button>
          <div className="flex items-center gap-4">
            {formData.status !== 'archived' && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'archived')}
                disabled={saving}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
              >
                Archive
              </button>
            )}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={saving || !formData.title || !formData.slug}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={saving || !formData.title || !formData.slug}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

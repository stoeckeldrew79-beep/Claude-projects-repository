import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticle, createScam } from '../services/admin';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { AlertLevel } from '../types';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function ScamForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [alertLevel, setAlertLevel] = useState('');

  const mutation = useMutation({
    mutationFn: createScam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scams'] });
      setName('');
      setDescription('');
      setAlertLevel('');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({
      name,
      slug: slugify(name),
      description,
      alert_level: (alertLevel || undefined) as AlertLevel | undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-5 space-y-3">
      <h2 className="font-semibold text-slate-900">Add a scam</h2>
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <textarea
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={4}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <select
        value={alertLevel}
        onChange={(e) => setAlertLevel(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="">No alert level</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
      >
        {mutation.isPending ? 'Saving…' : 'Save scam'}
      </button>
      {mutation.isSuccess && <p className="text-sm text-green-700">Saved.</p>}
      {mutation.isError && <p className="text-sm text-red-700">Couldn't save — check you're signed in as an admin.</p>}
    </form>
  );
}

function ArticleForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');

  const mutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      setTitle('');
      setBody('');
      setAuthor('');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({ title, slug: slugify(title), body, author: author || undefined, published: true });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-5 space-y-3">
      <h2 className="font-semibold text-slate-900">Publish an article</h2>
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author (optional)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <textarea
        required
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Body"
        rows={6}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-50"
      >
        {mutation.isPending ? 'Publishing…' : 'Publish'}
      </button>
      {mutation.isSuccess && <p className="text-sm text-green-700">Published.</p>}
      {mutation.isError && <p className="text-sm text-red-700">Couldn't publish — check you're signed in as an admin.</p>}
    </form>
  );
}

export default function Admin() {
  useDocumentMeta({ title: 'Admin', description: 'ScamShield National admin panel.', noindex: true });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin</h1>
      <p className="text-slate-600 mb-6">
        Scam data entry and article publishing. Requires an admin-role account (see backend{' '}
        <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">ADMIN_EMAILS</code>).
      </p>

      <div className="space-y-6">
        <ScamForm />
        <ArticleForm />
      </div>
    </div>
  );
}

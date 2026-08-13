import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createArticle, createScam } from '../services/admin';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { AlertLevel } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useDismissReport, usePendingReports, usePromoteReport } from '../hooks/useReports';
import { ScamReport } from '../services/reports';
import { COUNTRY_NAMES } from '../utils/countries';
import { useApproveDraft, useDiscardDraft, useDraftArticles } from '../hooks/useDrafts';
import { Article } from '../types';

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
  const [country, setCountry] = useState('US');

  const mutation = useMutation({
    mutationFn: createScam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scams'] });
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      setName('');
      setDescription('');
      setAlertLevel('');
      setCountry('US');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({
      name,
      slug: slugify(name),
      description,
      alert_level: (alertLevel || undefined) as AlertLevel | undefined,
      country,
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
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        {Object.entries(COUNTRY_NAMES).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
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

function slugFromDescription(description: string): string {
  return slugify(description.split(/\s+/).slice(0, 6).join(' '));
}

function ReportCard({ report }: { report: ScamReport }) {
  const [promoting, setPromoting] = useState(false);
  const [name, setName] = useState('');
  const [alertLevel, setAlertLevel] = useState('medium');
  const promote = usePromoteReport();
  const dismiss = useDismissReport();

  function handlePromote(e: FormEvent) {
    e.preventDefault();
    promote.mutate({ id: report.id, name, slug: slugFromDescription(name || report.description), alert_level: alertLevel });
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-900">{report.description}</p>
        <span className="shrink-0 text-xs text-slate-400">{new Date(report.created_at).toLocaleDateString()}</span>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
        {report.scammer_phone && (
          <div>
            <dt className="inline font-medium">Scammer phone:</dt> <dd className="inline">{report.scammer_phone}</dd>
          </div>
        )}
        {report.scammer_email && (
          <div>
            <dt className="inline font-medium">Scammer email:</dt> <dd className="inline">{report.scammer_email}</dd>
          </div>
        )}
        {report.money_lost_amount != null && (
          <div>
            <dt className="inline font-medium">Money lost:</dt> <dd className="inline">${report.money_lost_amount}</dd>
          </div>
        )}
        {(report.state || report.country) && (
          <div>
            <dt className="inline font-medium">Location:</dt>{' '}
            <dd className="inline">{[report.state, report.country].filter(Boolean).join(', ')}</dd>
          </div>
        )}
      </dl>

      {!promoting ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setPromoting(true)}
            className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium"
          >
            Promote to public scam
          </button>
          <button
            type="button"
            onClick={() => dismiss.mutate(report.id)}
            disabled={dismiss.isPending}
            className="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-medium disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      ) : (
        <form onSubmit={handlePromote} className="mt-3 flex flex-wrap gap-2 items-center">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Public scam name"
            className="rounded-md border border-slate-300 px-2 py-1.5 text-xs flex-1 min-w-[180px]"
          />
          <select
            value={alertLevel}
            onChange={(e) => setAlertLevel(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1.5 text-xs"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <button
            type="submit"
            disabled={promote.isPending}
            className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium disabled:opacity-50"
          >
            {promote.isPending ? 'Publishing…' : 'Confirm'}
          </button>
        </form>
      )}
      {promote.isError && <p className="mt-2 text-xs text-red-700">Couldn't promote this report.</p>}
    </div>
  );
}

function ReportsQueue() {
  const user = useAuthStore((s) => s.user);
  const { data: reports, isLoading, isError } = usePendingReports(Boolean(user));

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-900">Reports queue</h2>
      <p className="text-sm text-slate-500 mt-1">
        Public submissions from /report, awaiting review. Nothing here is visible to the public until promoted.
      </p>
      {isLoading && <p className="mt-3 text-sm text-slate-500">Loading…</p>}
      {isError && <p className="mt-3 text-sm text-red-700">Couldn't load reports — are you signed in as an admin?</p>}
      <div className="mt-4 space-y-3">
        {reports?.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
        {reports && reports.length === 0 && <p className="text-sm text-slate-500">No pending reports.</p>}
      </div>
    </div>
  );
}

function DraftCard({ draft }: { draft: Article }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(draft.title);
  const [body, setBody] = useState(draft.body);
  const approve = useApproveDraft();
  const discard = useDiscardDraft();

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm font-medium"
          />
        ) : (
          <h3 className="font-medium text-slate-900">{draft.title}</h3>
        )}
        <span className="shrink-0 text-xs text-slate-400">{new Date(draft.created_at).toLocaleDateString()}</span>
      </div>

      {editing ? (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
        />
      ) : (
        <p className="mt-2 text-sm text-slate-600 whitespace-pre-line line-clamp-4">{draft.body}</p>
      )}

      <div className="mt-3 flex gap-2">
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-medium"
          >
            Edit
          </button>
        )}
        <button
          type="button"
          onClick={() => approve.mutate(editing ? { id: draft.id, title, body } : { id: draft.id })}
          disabled={approve.isPending}
          className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium disabled:opacity-50"
        >
          {approve.isPending ? 'Publishing…' : editing ? 'Save & publish' : 'Approve & publish'}
        </button>
        <button
          type="button"
          onClick={() => discard.mutate(draft.id)}
          disabled={discard.isPending}
          className="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-medium disabled:opacity-50"
        >
          Discard
        </button>
      </div>
      {approve.isError && <p className="mt-2 text-xs text-red-700">Couldn't publish this draft.</p>}
    </div>
  );
}

function DraftsQueue() {
  const user = useAuthStore((s) => s.user);
  const { data: drafts, isLoading, isError } = useDraftArticles(Boolean(user));

  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-900">AI-drafted articles</h2>
      <p className="text-sm text-slate-500 mt-1">
        Drafted from real patterns in public report intake (recurring scammer contacts, category spikes) by{' '}
        <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">npm run draft-articles</code>. Never published
        automatically — review and edit before approving.
      </p>
      {isLoading && <p className="mt-3 text-sm text-slate-500">Loading…</p>}
      {isError && <p className="mt-3 text-sm text-red-700">Couldn't load drafts — are you signed in as an admin?</p>}
      <div className="mt-4 space-y-3">
        {drafts?.map((draft) => (
          <DraftCard key={draft.id} draft={draft} />
        ))}
        {drafts && drafts.length === 0 && <p className="text-sm text-slate-500">No drafts awaiting review.</p>}
      </div>
    </div>
  );
}

export default function Admin() {
  useDocumentMeta({ title: 'Admin', description: 'ScamShield National admin panel.', noindex: true });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin</h1>
      <p className="text-slate-600 mb-6">
        Scam data entry, report review, and article publishing. Requires an admin-role account (see backend{' '}
        <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">ADMIN_EMAILS</code>).
      </p>

      <div className="space-y-6">
        <ReportsQueue />
        <DraftsQueue />
        <ScamForm />
        <ArticleForm />
      </div>
    </div>
  );
}

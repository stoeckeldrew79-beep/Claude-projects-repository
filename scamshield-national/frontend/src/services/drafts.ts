import { api } from './api';
import { Article } from '../types';

export async function fetchDraftArticles() {
  const { data } = await api.get<{ data: Article[] }>('/articles/drafts');
  return data.data;
}

export async function approveDraft(id: string, edits?: { title?: string; body?: string }) {
  const { data } = await api.put<{ data: Article }>(`/articles/${id}`, { ...edits, published: true });
  return data.data;
}

export async function discardDraft(id: string) {
  await api.delete(`/articles/${id}`);
}

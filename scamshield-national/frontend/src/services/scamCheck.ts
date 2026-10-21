import { api } from './api';
import { Scam } from '../types';

export type CheckVerdict = 'high_risk' | 'suspicious' | 'no_signs';

export interface CheckSignal {
  id: string;
  title: string;
  why: string;
  severity: 'high' | 'medium' | 'low';
}

export interface CheckResult {
  verdict: CheckVerdict;
  score: number;
  signals: CheckSignal[];
  links: { url: string; host: string; issues: string[] }[];
  phones: string[];
  emails: string[];
  reportedContacts: { kind: 'phone' | 'email' | 'website'; value: string; reports: number; lastReportedAt: string | null }[];
  mentionedIn: { slug: string; name: string; host: string }[];
  similarScams: Scam[];
  ai: {
    verdict: 'likely_scam' | 'suspicious' | 'likely_legitimate' | 'not_enough_information';
    summary: string;
    red_flags: string[];
    next_steps: string[];
  } | null;
  aiAvailable: boolean;
}

// POST /v1/check — nothing sent here is stored.
export async function checkMessage(text: string) {
  const { data } = await api.post<{ data: CheckResult }>('/check', { text });
  return data.data;
}

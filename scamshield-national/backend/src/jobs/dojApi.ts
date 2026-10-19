// The Justice Department's public press-release API. Shared by the federal
// case archive (scanDojArchive.ts) and the scam-entry generator, which has
// no database of its own and so cannot import the archive job.
import { DojRelease } from './dojArchive';

const API = 'https://www.justice.gov/api/v1/press_releases.json';
export const DOJ_PAGE_SIZE = 50; // the API's maximum
const FETCH_TIMEOUT_MS = 30000;
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchDojPage(params: Record<string, string | number>): Promise<DojRelease[]> {
  const url = `${API}?${new URLSearchParams(
    Object.fromEntries(Object.entries({ pagesize: DOJ_PAGE_SIZE, ...params }).map(([k, v]) => [k, String(v)]))
  )}`;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'ScamShieldNational/1.0 (+federal fraud case archive)', Accept: 'application/json' },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { results?: DojRelease[] };
      return Array.isArray(body.results) ? body.results : [];
    } catch (err) {
      lastError = err;
      await sleep(2000 * attempt);
    }
  }
  throw new Error(`DOJ API failed for ${url}: ${(lastError as Error)?.message}`);
}

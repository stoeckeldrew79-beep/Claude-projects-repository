import { pool } from '../db/connection';

export interface StateAgSource {
  id: string;
  state: string;
  state_name: string;
  agency_name: string;
  consumer_protection_url: string;
  reports_url: string | null;
  has_published_reports: boolean;
  description: string;
}

export async function listStateAgSources() {
  const { rows } = await pool.query<StateAgSource>(`SELECT * FROM state_ag_sources ORDER BY state_name ASC`);
  return rows;
}

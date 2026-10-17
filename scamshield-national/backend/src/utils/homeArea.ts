import { InvalidStateError, isUsStateCode, stateForZip, UsStateCode } from './usStates';

export interface HomeArea {
  zip_code: string | null;
  state: UsStateCode | null;
}

// Validates a subscriber's home ZIP and/or state (signup and account
// settings). The home state is what state-targeted alerts match on, so it
// must be a real state code, never free text.
//
// - ZIP only: the state is derived from it.
// - State only: stored as given, ZIP cleared.
// - Both: they must agree, or a typo would quietly send someone another
//   state's alerts.
// - Both empty / null: clears the home area.
// Returns undefined when neither field was sent, so a profile update that
// is only about something else leaves the home area alone.
export function resolveHomeArea(input: { zip_code?: unknown; state?: unknown }): HomeArea | undefined {
  const zipSent = input.zip_code !== undefined;
  const stateSent = input.state !== undefined;
  if (!zipSent && !stateSent) return undefined;

  const rawZip = typeof input.zip_code === 'string' ? input.zip_code.trim() : input.zip_code;
  const rawState = typeof input.state === 'string' ? input.state.trim().toUpperCase() : input.state;

  if (rawZip !== undefined && rawZip !== null && typeof rawZip !== 'string') {
    throw new InvalidStateError('zip_code must be a 5-digit US ZIP code');
  }
  if (rawState !== undefined && rawState !== null && typeof rawState !== 'string') {
    throw new InvalidStateError('state must be a two-letter US state code');
  }

  const zip = rawZip ? rawZip : null;
  const state = rawState ? rawState : null;

  if (state !== null && !isUsStateCode(state)) {
    throw new InvalidStateError('state must be a two-letter US state code (50 states + DC)');
  }

  if (zip === null) return { zip_code: null, state };

  const derived = stateForZip(zip);
  if (!derived) {
    throw new InvalidStateError("That doesn't look like a US ZIP code — use 5 digits, e.g. 33101");
  }
  if (state !== null && state !== derived) {
    throw new InvalidStateError(`ZIP ${zip.slice(0, 5)} is in ${derived}, not ${state}`);
  }
  // ZIP+4 is stored as the 5-digit ZIP; alerts never target finer than that.
  return { zip_code: zip.slice(0, 5), state: derived };
}

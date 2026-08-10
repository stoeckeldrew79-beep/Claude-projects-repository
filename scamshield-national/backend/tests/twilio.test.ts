import { chunkRecipients, withOptOutFooter, CHUNK_SIZE } from '../src/services/twilio';

test('chunkRecipients splits into groups of 100', () => {
  const recipients = Array.from({ length: 250 }, (_, i) => i);
  const chunks = chunkRecipients(recipients);
  expect(chunks).toHaveLength(3);
  expect(chunks[0]).toHaveLength(100);
  expect(chunks[1]).toHaveLength(100);
  expect(chunks[2]).toHaveLength(50);
  expect(CHUNK_SIZE).toBe(100);
});

test('chunkRecipients handles empty input', () => {
  expect(chunkRecipients([])).toEqual([]);
});

test('chunkRecipients handles fewer than one chunk', () => {
  const chunks = chunkRecipients([1, 2, 3]);
  expect(chunks).toEqual([[1, 2, 3]]);
});

test('withOptOutFooter appends TCPA-required opt-out text', () => {
  const result = withOptOutFooter('Watch out for fake IRS calls');
  expect(result).toContain('Watch out for fake IRS calls');
  expect(result).toContain('Reply STOP to unsubscribe.');
});

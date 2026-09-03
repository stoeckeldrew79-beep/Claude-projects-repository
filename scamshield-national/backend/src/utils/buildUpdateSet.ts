// Builds a parameterized `SET col = $n, ...` clause from a request body,
// restricted to an explicit allowlist. Column names must NEVER be taken
// from arbitrary object keys — node-postgres only parameterizes $n value
// placeholders, not identifiers, so an unfiltered Object.keys(body) is a
// SQL injection (and, separately, a mass-assignment) vulnerability.
//
// Assumes the caller's query uses $1 for the row id, so value params
// start at $2.
export function buildUpdateSet(data: Record<string, unknown>, allowedFields: readonly string[]) {
  const fields = Object.keys(data).filter((f) => allowedFields.includes(f));
  const setClauses = fields.map((f, i) => `${f} = $${i + 2}`);
  const values = fields.map((f) => data[f]);
  return { fields, setClauses, values };
}

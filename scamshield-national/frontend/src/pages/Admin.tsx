// Internal tool to add/edit scams, publish alerts, manage users.
// Foundation phase: gated behind requireRole('admin') on the API;
// this page is the shell the real forms/tables get built into.
export default function Admin() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
      <p className="mt-2 text-slate-600">
        Scam data entry, alert publishing, and subscriber metrics. Admin-only — see backend `requireRole('admin')`.
      </p>
    </div>
  );
}

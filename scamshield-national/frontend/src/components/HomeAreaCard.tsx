import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUpdateProfile } from '../hooks/useAuth';
import { stateName } from '../utils/usStates';

function errorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { error?: string } } } | null)?.response?.data?.error ??
    "Couldn't save that — try again."
  );
}

// The signed-in user's home ZIP. State-targeted alerts go to people whose
// home state matches (plus anyone watching that state from the Alerts
// page), so this is what makes "alerts for your state" actually work.
// The server derives the state from the ZIP and rejects one that isn't a
// real US ZIP.
export function HomeAreaCard({ prominent = false }: { prominent?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const update = useUpdateProfile();
  const [zip, setZip] = useState(user?.zip_code ?? '');
  const [editing, setEditing] = useState(!user?.state);

  useEffect(() => {
    setZip(user?.zip_code ?? '');
  }, [user?.zip_code]);

  if (!user) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    update.mutate({ zip_code: zip.trim() || null }, { onSuccess: () => setEditing(false) });
  };

  const shell = prominent && !user.state
    ? 'rounded-2xl border border-amber-200 bg-amber-50 p-5'
    : 'rounded-2xl border border-slate-200 bg-white p-5';

  return (
    <section className={shell} aria-labelledby="home-area-heading">
      <h2 id="home-area-heading" className="font-semibold text-slate-900">
        {user.state ? 'Your home area' : 'Get alerts for your state'}
      </h2>

      {user.state && !editing ? (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{stateName(user.state)}</span>
            {user.zip_code ? ` · ZIP ${user.zip_code}` : ''} — you'll get alerts aimed at this state as well as
            nationwide ones.
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm font-medium text-[#8a2e2e] hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-slate-600">
            Add your ZIP code and we'll also send you warnings about scams targeting your state — not just
            nationwide ones. US only; never shared.
          </p>
          <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-2">
            <div>
              <label htmlFor="home-zip" className="block text-xs font-medium text-slate-600">
                ZIP code
              </label>
              <input
                id="home-zip"
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="[0-9]{5}(-[0-9]{4})?"
                maxLength={10}
                placeholder="e.g. 33101"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="mt-1 w-32 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={update.isPending}
              className="rounded-md bg-[#8a2e2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a2626] disabled:opacity-50"
            >
              {update.isPending ? 'Saving…' : 'Save'}
            </button>
            {user.state && (
              <button
                type="button"
                onClick={() => {
                  setZip(user.zip_code ?? '');
                  setEditing(false);
                  update.reset();
                }}
                className="px-2 py-2 text-sm text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            )}
          </form>
          {update.isError && (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {errorMessage(update.error)}
            </p>
          )}
        </>
      )}
    </section>
  );
}

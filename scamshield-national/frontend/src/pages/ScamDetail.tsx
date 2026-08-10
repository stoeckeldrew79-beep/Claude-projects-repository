import { useParams } from 'react-router-dom';
import { useScam } from '../hooks/useScams';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

function excerpt(text: string, length = 155): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

export default function ScamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: scam, isLoading } = useScam(slug);

  useDocumentMeta({
    title: scam?.name ?? 'Scam Detail',
    description: scam ? excerpt(scam.description) : 'Scam details from the ScamShield National database.',
    path: `/scams/${slug}`,
  });

  if (isLoading) return <p className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading…</p>;
  if (!scam) return <p className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Scam not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{scam.name}</h1>
      {scam.alert_level && (
        <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
          {scam.alert_level}
        </span>
      )}
      <p className="mt-4 text-slate-700 whitespace-pre-line">{scam.description}</p>

      {scam.locations && scam.locations.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-slate-900 mb-2">Reported locations</h2>
          <ul className="text-sm text-slate-600 space-y-1">
            {scam.locations.map((loc) => (
              <li key={loc.id}>
                {loc.is_nationwide ? 'Nationwide' : [loc.city, loc.state, loc.zip_code].filter(Boolean).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="mt-8 px-4 py-2 rounded-md border border-slate-300 text-sm font-medium">
        Report a sighting
      </button>
    </div>
  );
}

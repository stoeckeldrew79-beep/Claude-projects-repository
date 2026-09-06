const palettes = [
  ["#7c5cff", "#5ce1ff", "#0a0a0f"],
  ["#5ce1ff", "#7c5cff", "#0a0a0f"],
  ["#a78bfa", "#22d3ee", "#0a0a0f"],
  ["#7c5cff", "#f472b6", "#0a0a0f"],
];

export default function ServiceArtwork({ index }: { index: number }) {
  const [c1, c2, base] = palettes[index % palettes.length];
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-border"
      style={{ background: base }}
    >
      <div
        className="absolute inset-0 opacity-90 [animation:hue_16s_linear_infinite]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${c1}aa, transparent 55%), radial-gradient(circle at 80% 70%, ${c2}aa, transparent 55%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <span className="absolute bottom-4 right-5 font-mono text-[11px] tracking-widest text-white/50">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

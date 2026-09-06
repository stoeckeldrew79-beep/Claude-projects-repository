import type { ReactNode } from "react";

export default function Marquee({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div className="marquee-track">
        {[0, 1].map((rep) => (
          <div key={rep} className="flex shrink-0 items-center">
            {items.map((item, i) => (
              <span key={i} className="flex shrink-0 items-center">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

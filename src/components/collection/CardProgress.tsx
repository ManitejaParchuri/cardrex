interface CardProgressProps {
  collected: number;
  total: number;
}

export function CardProgress({ collected, total }: CardProgressProps) {
  const percentage = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <section className="collection-progress" aria-labelledby="collection-progress-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-violet-300/70 uppercase">
            Discovery progress
          </p>
          <h2 id="collection-progress-title" className="mt-1 text-lg font-bold text-white">
            Celestial Archive
          </h2>
        </div>
        <p className="font-display text-2xl font-black text-white">
          {collected}
          <span className="text-sm font-semibold text-violet-200/45"> / {total}</span>
        </p>
      </div>
      <div
        className="progress-track mt-5"
        role="progressbar"
        aria-label={`${collected} of ${total} cards discovered`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={collected}
      >
        <span className="progress-fill" style={{ width: `${percentage}%` }} />
        {[25, 50, 75].map((milestone) => (
          <span
            key={milestone}
            className="progress-milestone"
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[0.65rem] font-semibold tracking-wider text-violet-100/35 uppercase">
        <span>First spark</span>
        <span>Archive complete</span>
      </div>
    </section>
  );
}

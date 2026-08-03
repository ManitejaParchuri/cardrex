const slots = ['I', 'II', 'III', 'IV'];

export function CardShelf() {
  return (
    <section className="card-shelf" aria-labelledby="card-shelf-title">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.2em] text-sky-300/70 uppercase">
            Active set
          </p>
          <h2
            id="card-shelf-title"
            className="font-display mt-1 text-lg font-bold text-white"
          >
            Origins: First Light
          </h2>
        </div>
        <span className="set-badge">0 owned</span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2.5 sm:gap-4">
        {slots.map((slot) => (
          <div key={slot} className="locked-card-slot">
            <span className="locked-card-slot__star" aria-hidden="true">
              ✦
            </span>
            <span className="sr-only">Undiscovered card slot {slot}</span>
            <span className="locked-card-slot__number" aria-hidden="true">
              {slot}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-violet-100/45">
        Discover your first character to illuminate the archive.
      </p>
    </section>
  );
}

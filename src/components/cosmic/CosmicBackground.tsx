export function CosmicBackground() {
  return (
    <div className="cosmic-background" aria-hidden="true">
      <div className="cosmic-aurora cosmic-aurora--violet" />
      <div className="cosmic-aurora cosmic-aurora--blue" />
      <div className="star-field star-field--far" />
      <div className="star-field star-field--near" />
      <div className="cosmic-particles">
        {Array.from({ length: 9 }, (_, index) => (
          <span
            key={index}
            className={`cosmic-particle cosmic-particle--${index + 1}`}
          />
        ))}
      </div>
      <div className="shooting-star" />
    </div>
  );
}

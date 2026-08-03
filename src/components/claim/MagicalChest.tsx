export function MagicalChest() {
  return (
    <div
      className="chest-scene"
      role="img"
      aria-label="A sealed magical treasure chest"
    >
      <div className="chest-rune chest-rune--one" aria-hidden="true">
        ✦
      </div>
      <div className="chest-rune chest-rune--two" aria-hidden="true">
        ◇
      </div>
      <div className="chest-rune chest-rune--three" aria-hidden="true">
        ✧
      </div>
      <div className="magic-chest" aria-hidden="true">
        <div className="magic-chest__light" />
        <div className="magic-chest__lid">
          <div className="magic-chest__lid-band" />
          <div className="magic-chest__lid-studs">
            <span />
            <span />
          </div>
        </div>
        <div className="magic-chest__body">
          <div className="magic-chest__body-panel" />
          <div className="magic-chest__corner magic-chest__corner--left" />
          <div className="magic-chest__corner magic-chest__corner--right" />
          <div className="magic-chest__lock">
            <span>✦</span>
          </div>
        </div>
      </div>
      <div className="chest-shadow" aria-hidden="true" />
    </div>
  );
}

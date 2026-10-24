// A pill-shaped radio group with a thumb that slides to the chosen option.
export default function Segmented({ label, options, value, onChange }) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));

  return (
    <div
      className="seg"
      role="radiogroup"
      aria-label={label}
      style={{ "--n": options.length, "--i": index }}
    >
      <span className="seg__thumb" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={`seg__btn ${o.value === value ? "is-on" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

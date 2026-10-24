const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function TimerRing({ timeLeft, total, paused }) {
  const fraction = Math.max(0, timeLeft) / total;

  return (
    <div
      className={`timer ${timeLeft <= 5 ? "is-low" : ""} ${paused ? "is-paused" : ""}`}
      role="timer"
      aria-label={`${timeLeft} seconds left`}
    >
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className="timer__track" cx="22" cy="22" r={RADIUS} />
        <circle
          className="timer__bar"
          cx="22"
          cy="22"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>
      <span>{timeLeft}</span>
    </div>
  );
}

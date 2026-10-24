import { useEffect, useState } from "react";
import useCountUp from "../hooks/useCountUp.js";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TIMED_OUT = "__timed_out__";

function headline(pct) {
  if (pct >= 90) return "Outstanding.";
  if (pct >= 70) return "Great job.";
  if (pct >= 40) return "Not bad. Keep going.";
  return "A good start. Try again?";
}

export default function ResultScreen({ result, highScore, isNewBest, onReplay, onNew, loading }) {
  const { answers, correct, total, points } = result;
  const pct = Math.round((correct / total) * 100);

  const shownPoints = useCountUp(points, 1400);
  const shownPct = useCountUp(pct, 1200);

  // Flip to true after mount so the ring animates from empty to its value.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="screen result">
      <header className="result__head">
        <div className="ring" role="img" aria-label={`${pct} percent correct`}>
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="ring__track" cx="60" cy="60" r={RADIUS} />
            <circle
              className="ring__bar"
              cx="60"
              cy="60"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={ready ? CIRCUMFERENCE * (1 - pct / 100) : CIRCUMFERENCE}
            />
          </svg>
          <span className="ring__value">{shownPct}%</span>
        </div>

        <h1>{headline(pct)}</h1>
        <p className="result__sub">
          You got <strong>{correct}</strong> of <strong>{total}</strong> right.
        </p>

        <div className="result__points">
          <span className="result__num">{shownPoints}</span>
          <span className="result__unit">points</span>
        </div>

        {isNewBest ? (
          <p className="badge badge--best">New high score</p>
        ) : (
          <p className="badge">High score: {highScore}</p>
        )}
      </header>

      <div className="result__actions">
        <button type="button" className={`btn btn--primary ${loading ? "is-loading" : ""}`} onClick={onReplay} aria-busy={loading}>
          <span>{loading ? "Loading questions" : "Play again"}</span>
        </button>
        <button type="button" className="btn btn--ghost" onClick={onNew}>
          Change setup
        </button>
      </div>

      <h2 className="review__title">Review</h2>
      <ol className="review">
        {answers.map((a, i) => (
          <li
            key={i}
            className={`review__item ${a.isCorrect ? "is-right" : "is-missed"}`}
            style={{ "--i": i }}
          >
            <span className="review__icon" aria-hidden="true">
              {a.isCorrect ? "✓" : "✕"}
            </span>
            <div>
              <p className="review__q">{a.question}</p>
              {a.isCorrect ? (
                <p className="review__a">{a.correct}</p>
              ) : (
                <p className="review__a">
                  {a.selected === TIMED_OUT ? "No answer" : <s>{a.selected}</s>}
                  <span className="review__sep"> / </span>
                  <strong>{a.correct}</strong>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

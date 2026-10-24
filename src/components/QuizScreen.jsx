import { useEffect, useRef, useState } from "react";
import TimerRing from "./TimerRing.jsx";
import {
  TIME_PER_QUESTION,
  POINTS_CORRECT,
  POINTS_PER_SECOND_LEFT,
} from "../constants.js";

const LETTERS = ["A", "B", "C", "D"];
const TIMED_OUT = "__timed_out__";

export default function QuizScreen({ questions, settings, onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null); // null = not answered yet
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);
  const nextRef = useRef(null);

  const q = questions[index];
  const total = questions.length;
  const answered = selected !== null;
  const isLast = index === total - 1;
  const points = answers.reduce(
    (sum, a) => sum + (a.isCorrect ? POINTS_CORRECT + a.timeLeft * POINTS_PER_SECOND_LEFT : 0),
    0
  );
  const last = answers[answers.length - 1];

  const choose = (value) => {
    if (answered) return;
    setSelected(value);
    setAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        correct: q.correct,
        selected: value,
        isCorrect: value === q.correct,
        timeLeft: value === q.correct ? timeLeft : 0,
      },
    ]);
  };

  const next = () => {
    if (!answered) return;
    if (isLast) {
      onFinish(answers);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setTimeLeft(TIME_PER_QUESTION);
  };

  // Countdown: one tick per second until answered or time runs out.
  useEffect(() => {
    if (answered) return undefined;
    if (timeLeft <= 0) {
      choose(TIMED_OUT);
      return undefined;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, timeLeft]);

  // Move focus to "Next" after answering, so Enter continues the quiz.
  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);

  // Keyboard: A–D or 1–4 to answer, → to continue.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      const pos = ["a", "b", "c", "d"].indexOf(key);
      const num = ["1", "2", "3", "4"].indexOf(key);
      const optionIndex = pos !== -1 ? pos : num;
      if (optionIndex !== -1 && q.options[optionIndex]) {
        choose(q.options[optionIndex]);
      } else if (e.key === "ArrowRight") {
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const progress = ((index + (answered ? 1 : 0)) / total) * 100;

  let feedback = "";
  let feedbackTone = "";
  if (answered && last) {
    if (selected === TIMED_OUT) {
      feedback = "Time's up";
      feedbackTone = "bad";
    } else if (last.isCorrect) {
      feedback = `Correct  +${POINTS_CORRECT + last.timeLeft * POINTS_PER_SECOND_LEFT}`;
      feedbackTone = "good";
    } else {
      feedback = "Not quite";
      feedbackTone = "bad";
    }
  }

  return (
    <section className="screen quiz">
      <header className="quiz__top">
        <div className="tags">
          <span className="tag">{q.category}</span>
          <span className="tag tag--soft">{settings.difficulty}</span>
        </div>
        <span className="quiz__points" aria-label={`${points} points`}>
          {points} pts
        </span>
      </header>

      <div
        className="bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index + (answered ? 1 : 0)}
        aria-label="Quiz progress"
      >
        <div className="bar__fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz__meta">
        <p className="quiz__count">
          Question <strong>{index + 1}</strong> of {total}
        </p>
        <TimerRing timeLeft={timeLeft} total={TIME_PER_QUESTION} paused={answered} />
      </div>

      <div className="quiz__body" key={index}>
        <h2 className="question">{q.question}</h2>

        <ul className={`options ${answered ? "is-locked" : ""}`}>
          {q.options.map((opt, i) => {
            const isCorrect = opt === q.correct;
            const isPicked = opt === selected;
            let state = "";
            if (answered) {
              if (isCorrect) state = "is-correct";
              else if (isPicked) state = "is-wrong";
              else state = "is-dim";
            }
            return (
              <li key={opt} style={{ "--i": i }}>
                <button
                  type="button"
                  className={`option ${state}`}
                  aria-disabled={answered}
                  onClick={() => choose(opt)}
                >
                  <span className="option__key">{LETTERS[i]}</span>
                  <span className="option__text">{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <footer className="quiz__foot">
        <p className={`feedback ${feedbackTone ? `feedback--${feedbackTone}` : ""}`} aria-live="polite">
          {feedback}
        </p>
        <button
          ref={nextRef}
          type="button"
          className="btn btn--primary"
          disabled={!answered}
          onClick={next}
        >
          {isLast ? "See results" : "Next question"}
        </button>
      </footer>
    </section>
  );
}

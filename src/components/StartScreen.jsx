import { useState } from "react";
import { CATEGORIES, DIFFICULTIES, AMOUNTS } from "../constants.js";
import Segmented from "./Segmented.jsx";

export default function StartScreen({ initial, onStart, loading, error }) {
  const [category, setCategory] = useState(initial.category);
  const [difficulty, setDifficulty] = useState(initial.difficulty);
  const [amount, setAmount] = useState(initial.amount);

  const submit = (e) => {
    e.preventDefault();
    if (loading) return;
    onStart({ category, difficulty, amount });
  };

  return (
    <form className="screen start" onSubmit={submit}>
      <header className="start__hero">
        <div className="mark" aria-hidden="true">
          <span>?</span>
        </div>
        <h1>Quiz Master</h1>
        <p>Test your knowledge, challenge yourself and have fun.</p>
      </header>

      {error && (
        <p className="alert" role="alert" key={error}>
          {error}
        </p>
      )}

      <section className="field">
        <h2 className="field__label" id="category-label">
          Category
        </h2>
        <div className="chips" role="radiogroup" aria-labelledby="category-label">
          {CATEGORIES.map((c) => {
            const on = c.id === category;
            return (
              <button
                key={c.name}
                type="button"
                role="radio"
                aria-checked={on}
                className={`chip ${on ? "is-on" : ""}`}
                onClick={() => setCategory(c.id)}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </section>

      <div className="field-row">
        <section className="field">
          <h2 className="field__label">Difficulty</h2>
          <Segmented
            label="Difficulty"
            options={DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
          />
        </section>

        <section className="field">
          <h2 className="field__label">Questions</h2>
          <Segmented
            label="Number of questions"
            options={AMOUNTS}
            value={amount}
            onChange={setAmount}
          />
        </section>
      </div>

      <button
        type="submit"
        className={`btn btn--primary btn--block ${loading ? "is-loading" : ""}`}
        aria-busy={loading}
      >
        <span>{loading ? "Loading questions" : "Start quiz"}</span>
      </button>
    </form>
  );
}

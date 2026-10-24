# Quiz Master

A trivia quiz built with React + Vite. Questions come from the free [Open Trivia DB](https://opentdb.com/).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for production

```bash
npm run build      # outputs to /dist
npm run preview
```

Deploy the `dist` folder to Netlify, Vercel, GitHub Pages or Render (static site).

## How it works

- Pick a category, difficulty and number of questions, then start.
- 15 seconds per question. A correct answer scores 100 points plus 5 for every second left.
- Keyboard: press A–D (or 1–4) to answer and → or Enter to continue.
- Your high score is saved in the browser (`localStorage`).

## Project structure

- `src/api.js` — fetches and shuffles questions from Open Trivia DB
- `src/constants.js` — categories, difficulty levels, timer and scoring values
- `src/components/` — StartScreen, QuizScreen, ResultScreen, TimerRing, Segmented
- `src/hooks/useCountUp.js` — number count-up animation for the results
- `src/styles.css` — all styling; colours and fonts are variables at the top

## Notes

Open Trivia DB allows about one request every 5 seconds per visitor. If someone starts quizzes
back-to-back, the app shows a friendly message asking them to wait a moment.

Never put API keys in front-end code. This project doesn't need any.

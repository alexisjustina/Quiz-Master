import { useState } from "react";
import StartScreen from "./components/StartScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import { fetchQuestions } from "./api.js";
import { POINTS_CORRECT, POINTS_PER_SECOND_LEFT } from "./constants.js";

const HIGH_SCORE_KEY = "quiz-master-high-score";

function readHighScore() {
  try {
    return Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  } catch {
    return 0;
  }
}

export default function App() {
  const [screen, setScreen] = useState("start"); // start | quiz | result
  const [settings, setSettings] = useState({ category: 9, difficulty: "medium", amount: 10 });
  const [questions, setQuestions] = useState([]);
  const [quizId, setQuizId] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [highScore, setHighScore] = useState(readHighScore);
  const [isNewBest, setIsNewBest] = useState(false);

  const startQuiz = async (nextSettings) => {
    setSettings(nextSettings);
    setError("");
    setLoading(true);
    try {
      const list = await fetchQuestions(nextSettings);
      setQuestions(list);
      setQuizId((id) => id + 1);
      setScreen("quiz");
    } catch (err) {
      setError(err.message);
      setScreen("start");
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = (answers) => {
    const correct = answers.filter((a) => a.isCorrect).length;
    const points = answers.reduce(
      (sum, a) => sum + (a.isCorrect ? POINTS_CORRECT + a.timeLeft * POINTS_PER_SECOND_LEFT : 0),
      0
    );
    const best = points > highScore;
    if (best) {
      setHighScore(points);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, String(points));
      } catch {
        /* storage unavailable — keep going */
      }
    }
    setIsNewBest(best && points > 0);
    setResult({ answers, correct, points, total: answers.length });
    setScreen("result");
  };

  return (
    <div className="app">
      <header className="nav">
        <span className="nav__brand">Quiz Master</span>
        <span className="nav__score">
          High score <b key={highScore}>{highScore}</b>
        </span>
      </header>

      <main className="stage">
        {screen === "start" && (
          <StartScreen initial={settings} onStart={startQuiz} loading={loading} error={error} />
        )}
        {screen === "quiz" && (
          <QuizScreen key={quizId} questions={questions} settings={settings} onFinish={finishQuiz} />
        )}
        {screen === "result" && result && (
          <ResultScreen
            result={result}
            highScore={highScore}
            isNewBest={isNewBest}
            loading={loading}
            onReplay={() => startQuiz(settings)}
            onNew={() => setScreen("start")}
          />
        )}
      </main>
    </div>
  );
}

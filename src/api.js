// Fetches multiple-choice questions from the Open Trivia DB.
// `encode=url3986` makes the API return safely encoded text, so characters like
// &quot; and &#039; never show up raw on screen.

const decode = (value) => decodeURIComponent(value);

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function fetchQuestions({ amount, category, difficulty }) {
  const params = new URLSearchParams({
    amount: String(amount),
    type: "multiple",
    encode: "url3986",
  });
  if (category) params.set("category", String(category));
  if (difficulty) params.set("difficulty", difficulty);

  let res;
  try {
    res = await fetch(`https://opentdb.com/api.php?${params}`);
  } catch {
    throw new Error("Couldn't reach the question server. Check your connection and try again.");
  }

  if (res.status === 429) {
    throw new Error("Too many requests. Wait a few seconds and try again.");
  }
  if (!res.ok) {
    throw new Error("The question server had a problem. Try again in a moment.");
  }

  const data = await res.json();

  if (data.response_code === 1) {
    throw new Error("Not enough questions for that mix. Try fewer questions or another difficulty.");
  }
  if (data.response_code === 5) {
    throw new Error("Too many requests. Wait a few seconds and try again.");
  }
  if (data.response_code !== 0 || !data.results?.length) {
    throw new Error("Couldn't load questions. Try a different setup.");
  }

  return data.results.map((item) => {
    const correct = decode(item.correct_answer);
    const incorrect = item.incorrect_answers.map(decode);
    return {
      question: decode(item.question),
      category: decode(item.category),
      difficulty: item.difficulty,
      correct,
      options: shuffle([correct, ...incorrect]),
    };
  });
}

"use client";

import { useState } from "react";

type Word = {
  english: string;
  korean: string;
};

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([]);

  const fetchAllWords = async () => {
    const res = await fetch("/api/words/all");
    const data = await res.json();
    setWords(data);
  };

  const fetchRandomWords = async () => {
    const res = await fetch("/api/words/random");
    const data = await res.json();
    setWords(data);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>단어 가져오기</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={fetchAllWords} style={{ marginRight: "1rem" }}>
          모든 단어 테스트
        </button>
        <button onClick={fetchRandomWords}>
          랜덤 20개 단어 테스트
        </button>
      </div>

      <ul>
        {words.map((word, i) => (
          <li key={i}>
            <strong>{word.english}</strong> - {word.korean}
          </li>
        ))}
      </ul>
    </main>
  );
}

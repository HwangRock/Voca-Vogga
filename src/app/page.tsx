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
    <main>
      <h1>📚 Notion 단어 테스트</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={fetchAllWords}>모든 단어 가져오기</button>
        <button onClick={fetchRandomWords}>랜덤 20개 단어 가져오기</button>
      </div>
      <ul>
        {words.map((w, i) => (
          <li key={i}>
            <span><strong>{w.english}</strong></span>
            <span>{w.korean}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

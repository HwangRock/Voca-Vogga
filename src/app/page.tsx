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
      <h1>HwangRock 영단어 테스트</h1>
      <h3>상특) 영단어장을 직접 만든다.</h3>
      <div className="button-container" style={{ marginBottom: "20px" }}>
        <button onClick={fetchAllWords}>모든 단어 테스트</button>
        <button onClick={fetchRandomWords}>랜덤 20개 단어 테스트</button>
        <button onClick={fetchAllWords}>영단어장</button>
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

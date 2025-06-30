"use client";

import { useState } from "react";

type Word = {
  english: string;
  korean: string;
};

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);

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

  const startTest = async (isRandom = false) => {
    const url = isRandom ? "/api/words/random" : "/api/words/all";
    const res = await fetch(url);
    const data = await res.json();
    setWords(data);
    setIsTesting(true);
    setCurrentIndex(0);
    setScore(0);
    setInputValue("");
  };

  const nextWord = () => {
    if (
      inputValue.trim() ===
      words[currentIndex].korean.trim()
    ) {
      setScore(score + 1);
    }

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
      setInputValue("");
    } else {
      setIsTesting(false);
      alert(
        `테스트 끝!\n점수: ${score + (inputValue.trim() === words[currentIndex].korean.trim() ? 1 : 0)
        }/${words.length} (${Math.round(
          ((score + (inputValue.trim() === words[currentIndex].korean.trim() ? 1 : 0)) / words.length) * 100
        )}%)`
      );
    }
  };

  return (
    <main className="fade-in">
      <h1>HwangRock 영단어 테스트</h1>
      <h3>상특) 영단어장을 직접 만든다.</h3>

      {!isTesting && (
        <div className="button-container">
          <button onClick={() => startTest(false)}>모든 단어 테스트</button>
          <button onClick={() => startTest(true)}>랜덤 20개 단어 테스트</button>
          <button onClick={fetchAllWords}>영단어장</button>
        </div>
      )}

      {isTesting && words.length > 0 && (
        <div className="test-container fade-in">
          <p className="test-progress">
            {currentIndex + 1} / {words.length}
          </p>

          <h2>{words[currentIndex].english}</h2>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="뜻을 입력하세요"
            className="test-input"
          />

          <div className="next-button-wrapper">
            <button onClick={nextWord}>다음</button>
          </div>
        </div>
      )}

      {!isTesting && words.length > 0 && (
        <ul>
          {words.map((w, i) => (
            <li key={i} className="fade-in">
              <span><strong>{w.english}</strong></span>
              <span>{w.korean}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

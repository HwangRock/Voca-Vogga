"use client";

import { useState } from "react";

type Word = {
  english: string;
  korean: string;
};

type WrongWord = {
  english: string;
  korean: string;
  wrongAnswer: string;
};

export default function HomePage() {
  const [words, setWords] = useState<Word[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [wrongWords, setWrongWords] = useState<WrongWord[]>([]);
  const [showResult, setShowResult] = useState(false);

  const fetchAllWords = async () => {
    const res = await fetch("/api/words/all");
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
    setWrongWords([]);
    setShowResult(false);
  };

  const nextWord = () => {
    const correct = inputValue.trim() === words[currentIndex].korean.trim();

    if (!correct) {
      setWrongWords((prev) => [
        ...prev,
        {
          english: words[currentIndex].english,
          korean: words[currentIndex].korean,
          wrongAnswer: inputValue || "미입력",
        },
      ]);
    } else {
      setScore(score + 1);
    }

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
      setInputValue("");
    } else {
      setIsTesting(false);
      setShowResult(true);
    }
  };

  const restartWithWrongWords = () => {
    if (wrongWords.length === 0) return;

    const wordsToRetry = wrongWords.map((w) => ({
      english: w.english,
      korean: w.korean,
    }));

    setWords(wordsToRetry);
    setWrongWords([]);
    setIsTesting(true);
    setCurrentIndex(0);
    setScore(0);
    setInputValue("");
    setShowResult(false);
  };

  return (
    <main className="fade-in">
      <h1>HwangRock 영단어 테스트</h1>
      <h3>상특) 영단어장을 직접 만든다.</h3>

      {!isTesting && !showResult && (
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

      {showResult && (
        <div className="test-result fade-in">
          <h2>테스트 결과</h2>
          <p>
            점수: {score} / {words.length} (
            {Math.round((score / words.length) * 100)}%)
          </p>

          {wrongWords.length > 0 ? (
            <>
              <h3>틀린 단어 목록</h3>
              <ul>
                {wrongWords.map((w, i) => (
                  <li key={i}>
                   
                    <strong>{w.english}</strong> 
                     <span style={{ color: "red", marginLeft: "10px" }}>
                      ({w.wrongAnswer})
                    </span>
                    {w.korean}
                  </li>
                ))}
              </ul>
              <button onClick={restartWithWrongWords}>
                틀린 단어 재테스트
              </button>
              <p>돌아가려면 F5를 누르세요.</p>
            </>
          ) : (
            <p>모든 단어를 맞췄어요! 🎉 <br />
              돌아가려면 F5를 누르세요.</p>
          )}
        </div>
      )}

      {!isTesting && !showResult && words.length > 0 && (
        <ul>
          {words.map((w, i) => (
            <li key={i} className="fade-in">
              <span>
                <strong>{w.english}</strong>
              </span>
              <span>{w.korean}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

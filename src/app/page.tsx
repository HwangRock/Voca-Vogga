"use client";

import useWordTest from "@/app/hooks/useWordTest";
import TestPanel from "@/app/components/TestPanel";
import ResultPanel from "@/app/components/ResultPanel";

export default function HomePage() {
  const {
    words,
    isTesting,
    currentIndex,
    inputValue,
    score,
    wrongWords,
    showResult,
    setInputValue,
    fetchAllWords,
    startTest,
    nextWord,
    toggleCheck,
    restartWithWrongWords,
  } = useWordTest();


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
        <TestPanel
          words={words}
          currentIndex={currentIndex}
          inputValue={inputValue}
          setInputValue={setInputValue}
          nextWord={nextWord}
        />
      )}

      {showResult && (
        <ResultPanel
          score={score}
          wordsLength={words.length}
          wrongWords={wrongWords}
          toggleCheck={toggleCheck}
          restartWithWrongWords={restartWithWrongWords}
        />
      )}

      {!isTesting && !showResult && words.length > 0 && (
        <ul>
          {words.map((w, i) => (
            <li key={i} className="wrong-word-row">
              <span className="wrong-word-english">{w.english}</span>
              <span className="wrong-word-wrong"></span>
              <span className="wrong-word-correct">{w.korean}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

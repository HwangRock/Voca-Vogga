"use client";

import useWordTest from "@/app/hooks/useWordTest";
import TestPanel from "@/app/components/TestPanel";
import ResultPanel from "@/app/components/ResultPanel";
import VocabList from "@/app/components/VocabList";

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
      <h1>HwangRock English Voca Test</h1>
      <h3>&quot;Rome wasn’t built in a day&quot;</h3>

      {!isTesting && !showResult && (
        <div className="button-container">
          <button onClick={() => startTest(false)}>All Word Test</button>
          <button onClick={() => startTest(true)}>Random 20 Word Test</button>
          <button onClick={fetchAllWords}>Notebook</button>
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
        <div className="fade-in">
          <VocabList words={words} />
        </div>
      )}
    </main>
  );
}

"use client";

import useWordTest from "@/app/hooks/useWordTest";
import TestPanel from "@/app/components/TestPanel";
import ResultPanel from "@/app/components/ResultPanel";
import { useEffect } from "react";

export default function RandomWordTestPage() {
  const {
    words, isTesting, currentIndex, inputValue, score,
    wrongWords, showResult, setInputValue, nextWord,
    toggleCheck, restartWithWrongWords, startTest,
  } = useWordTest();

  useEffect(() => {
    startTest(true);
  }, []);

  return (
    <>
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
    </>
  );
}

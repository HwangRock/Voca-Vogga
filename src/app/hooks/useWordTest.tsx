import { useState } from "react";
import { Word, WrongWord } from "@/types";

export default function useWordTest() {
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
    const correct =
      inputValue.trim() === words[currentIndex].korean.trim();

    if (!correct) {
      setWrongWords((prev) => [
        ...prev,
        {
          english: words[currentIndex].english,
          korean: words[currentIndex].korean,
          wrongAnswer: inputValue || "미입력",
          checked: false,
        },
      ]);
    } else {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
      setInputValue("");
    } else {
      setIsTesting(false);
      setShowResult(true);
    }
  };

  const toggleCheck = (index: number) => {
    const checkedNow = wrongWords[index].checked;
    const newChecked = !checkedNow;

    setScore((prev) =>
      newChecked ? prev + 1 : Math.max(0, prev - 1)
    );

    setWrongWords((prev) =>
      prev.map((w, i) =>
        i === index ? { ...w, checked: newChecked } : w
      )
    );
  };

  const restartWithWrongWords = () => {
    const wordsToRetry = wrongWords
      .filter((w) => !w.checked)
      .map((w) => ({
        english: w.english,
        korean: w.korean,
      }));

    if (wordsToRetry.length === 0) {
      alert("재시험할 단어가 없습니다.");
      return;
    }

    setWords(wordsToRetry);
    setWrongWords([]);
    setIsTesting(true);
    setCurrentIndex(0);
    setScore(0);
    setInputValue("");
    setShowResult(false);
  };

  return {
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
  };
}

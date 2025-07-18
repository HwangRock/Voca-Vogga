/* eslint-disable */
"use client";

import VocabList from "@/app/components/VocabList";
import useWordTest from "@/app/hooks/useWordTest";
import { useEffect } from "react";
import { renderWords } from "@/app/utils/func";

export default function NotebookPage() {
  const { words, fetchAllWords } = useWordTest();

  useEffect(() => {
    fetchAllWords();
  }, []);

  return (
    <main className="fade-in">
      <h1>My Vocabulary Notebook</h1>
      <h3>constantly updating...</h3>
      {renderWords(words, VocabList, { words })}
    </main>
  );
}

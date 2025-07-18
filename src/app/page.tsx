"use client";

import useWordTest from "@/app/hooks/useWordTest";
import TestPanel from "@/app/components/TestPanel";
import ResultPanel from "@/app/components/ResultPanel";
import { useRouter } from "next/navigation";

export default function HomePage() {
  
  const router = useRouter();

  return (
    <main className="fade-in">
      <h1>HwangRock English Voca Test</h1>
      <h3>&quot;Rome wasn’t built in a day&quot;</h3>

      <div className="button-container">
          <button onClick={() => router.push("/test/all")}>All Word Test</button>
          <button onClick={() => router.push("/test/random")}>Random 20 Word Test</button>
          <button onClick={() => router.push("/notebook")}>Notebook</button>
      </div>
    </main>
  );
}

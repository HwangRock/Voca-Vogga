import { ReactNode } from "react";

export default function TestLayout({ children }: { children: ReactNode }) {
  return (
    <main className="fade-in">
      <h1>Vocabulary Test</h1>
      <h3>&quot;Repeat until all correct&quot;</h3>
      {children}
    </main>
  );
}

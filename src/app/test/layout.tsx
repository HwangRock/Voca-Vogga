import { ReactNode } from "react";

export default function TestLayout({ children }: { children: ReactNode }) {
  return (
    <main className="fade-in">
      <h1>Vocabulary Test</h1>
      <h3>"Repeat until all correct"</h3>
      {children}
    </main>
  );
}

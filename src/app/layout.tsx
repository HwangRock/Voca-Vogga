// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "HwangRock Voca Test",
  description: "영단어 테스트 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link href="/">🏠 Home</Link>
            <Link href="/test/all">📝 All Test</Link>
            <Link href="/test/random">🎲 Random Test</Link>
            <Link href="/notebook">📘 Notebook</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/testing");

  if (hideHeader) return null;

  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link href="/">🏠 Home</Link>
        <Link href="/test/all">📝 All Test</Link>
        <Link href="/test/random">🎲 Random Test</Link>
        <Link href="/notebook">📘 Notebook</Link>
      </nav>
    </header>
  );
}

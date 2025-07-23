import React from "react";

interface Word {
  english: string;
  korean: string;
}

export function renderWords<P extends Record<string, unknown>>(
    words: Word[],
    Component: React.ComponentType<P>,
    props: P
): React.ReactNode {
    const len = words.length;
    if (len > 0) {
        return <Component {...props} />;
    }
    else {
        return <p>Loading words...</p>;
    }
}

/*
function modInverse(a: number, m: number): number {
  let m0 = m, x0 = 0, x1 = 1;
  if (m === 1) return 0;

  while (a > 1) {
    const q = Math.floor(a / m);
    [a, m] = [m, a % m];
    [x0, x1] = [x1 - q * x0, x0];
  }

  return x1 < 0 ? x1 + m0 : x1;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function chineseRemainder(a1: number, m1: number, a2: number, m2: number): number {
  const M = m1 * m2;
  const M1 = M / m1;
  const M2 = M / m2;

  const y1 = modInverse(M1, m1);
  const y2 = modInverse(M2, m2);

  const x = (a1 * M1 * y1 + a2 * M2 * y2) % M;
  return (x + M) % M;
}*/

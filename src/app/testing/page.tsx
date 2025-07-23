"use client";

import { useEffect, useState } from "react";

export default function TestingPage() {
  const [position, setPosition] = useState(0);
  const startX = 20;
  const endX = 300;
  const arrowLength = 10;
  const maxMove = endX - startX - arrowLength;

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev >= maxMove) {
          clearInterval(interval);
          return maxMove;
        }
        return prev + 3;
      });
    }, 16); // 약 60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🧭 Arrow Drawing Animation</h1>
      <svg width="360" height="100" xmlns="http://www.w3.org/2000/svg">
        {/* 선: 화살촉이 이동한 만큼만 그려짐 */}
        <line
          x1={startX}
          y1="50"
          x2={startX + position}
          y2="50"
          stroke="#1d4ed8"
          strokeWidth="4"
        />

        {/* 화살촉 */}
        <polygon
          points="0,-7 10,0 0,7"
          fill="#1d4ed8"
          transform={`translate(${startX + position}, 50)`}
        />
      </svg>
    </main>
  );
}

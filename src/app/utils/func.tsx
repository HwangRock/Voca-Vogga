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

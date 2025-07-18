import React from "react";

export function renderWords<P extends Record<string, unknown>>(
    words: any[],
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

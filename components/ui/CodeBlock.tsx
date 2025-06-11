"use client";

import { Highlight, PrismTheme } from "prism-react-renderer";

export const CodeBlock = ({ code, language = "tsx" }: { code: string; language?: string }) => {
  const customTheme: PrismTheme = {
    // Mandatory `plain` property for base styles
    plain: {
      color: "var(--foreground)", // Default text color
    },
    // Custom styles for specific tokens
    styles: [
      {
        types: ["tag", "function", "comment", "console"],
        style: {
          opacity: 0.6,
        },
      },
      {
        types: ["keyword"],
        style: {
          fontStyle: "italic",
          opacity: 0.6,
        },
      },

      {
        types: ["punctuation"],
        style: { opacity: 0.3 },
      },
      {
        types: ["string"],
        style: {
          color: "oklch(70.4% 0.14 182.503)",
        },
      },
    ],
  };

  return (
    <Highlight theme={customTheme} code={code} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className="text-[0.825rem]">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="pr-4 opacity-50">{(i + 1).toString().padStart(2, "0")}</span>
              {line.map((token, key) => {
                return <span key={key} {...getTokenProps({ token })} />;
              })}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

"use client";

import { Highlight, PrismTheme } from "prism-react-renderer";

const darkTheme: PrismTheme = {
  plain: {
    color: "var(--foreground)",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "var(--muted-foreground)",
        opacity: 0.75,
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "var(--muted-foreground)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "oklch(77.7% 0.152 181.912)",
      },
    },
  ],
};

const lightTheme: PrismTheme = {
  plain: {
    color: "var(--foreground)",
  },
  styles: [
    {
      types: ["comment"],
      style: {
        color: "var(--muted-foreground)",
        opacity: 0.75,
      },
    },
    {
      types: ["keyword"],
      style: {
        color: "var(--muted-foreground)",
      },
    },
    {
      types: ["string"],
      style: {
        color: "oklch(60% 0.118 184.704)",
      },
    },
  ],
};

export const CodeBlock = ({ code, language = "ts" }: { code: string; language?: string }) => {
  return (
    <>
      <div className="hidden dark:block">
        <Highlight theme={darkTheme} code={code} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={style} className="text-[0.80rem]">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="text-muted-foreground pr-4 font-mono opacity-50">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  {line.map((token, key) => {
                    return <span key={key} {...getTokenProps({ token })} />;
                  })}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      <div className="dark:hidden">
        <Highlight theme={lightTheme} code={code} language={language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={style} className="text-[0.80rem]">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="text-muted-foreground pr-4 font-mono opacity-50">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  {line.map((token, key) => {
                    return <span key={key} {...getTokenProps({ token })} />;
                  })}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </>
  );
};

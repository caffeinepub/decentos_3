import { r as reactExports, j as jsxRuntimeExports } from "./index-CZGIn5x2.js";
const DEFAULT_MD = `# Welcome to Markdown Viewer

This is a **live preview** editor. Type on the left, see rendered output on the right.

## Features

- Real-time rendering
- **Bold** and *italic* text
- Code blocks and \`inline code\`
- Headings, lists, and more

## Code Example

\`\`\`motoko
actor DecentOS {
  stable var version : Text = "5.0";

  public query func getVersion() : async Text {
    version
  };
};
\`\`\`

## About

Markdown is a lightweight markup language. It's widely used for documentation, notes, and README files.

> Built with love on the Internet Computer blockchain.
`;
function renderMarkdown(md) {
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(
    /```([\s\S]*?)```/g,
    (_m, code) => `<pre style="background:rgba(0,0,0,0.4);border:1px solid rgba(42,58,66,0.8);border-radius:6px;padding:12px;overflow-x:auto;font-size:11px;color:rgba(39,215,224,0.85);font-family:monospace;margin:8px 0">${code.trim()}</pre>`
  );
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(0,0,0,0.35);border:1px solid rgba(42,58,66,0.5);border-radius:3px;padding:1px 5px;font-size:11px;color:rgba(245,158,11,0.9);font-family:monospace">$1</code>'
  );
  html = html.replace(
    /^&gt; (.+)$/gm,
    '<blockquote style="border-left:3px solid rgba(39,215,224,0.4);padding-left:12px;margin:6px 0;color:rgba(180,200,210,0.55);font-style:italic">$1</blockquote>'
  );
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 style="font-size:13px;font-weight:700;color:rgba(220,235,240,0.9);margin:14px 0 6px">$1</h3>'
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="font-size:15px;font-weight:700;color:rgba(39,215,224,0.85);margin:16px 0 8px">$1</h2>'
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 style="font-size:18px;font-weight:800;color:rgba(220,235,240,0.95);margin:0 0 10px">$1</h1>'
  );
  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong style="color:rgba(220,235,240,1);font-weight:700">$1</strong>'
  );
  html = html.replace(
    /\*([^*]+)\*/g,
    '<em style="color:rgba(180,200,210,0.8);font-style:italic">$1</em>'
  );
  html = html.replace(
    /^- (.+)$/gm,
    '<li style="margin:3px 0;padding-left:4px">$1</li>'
  );
  html = html.replace(
    /(<li[^>]*>[\s\S]*?<\/li>\n?)+/g,
    (match) => `<ul style="margin:8px 0;padding-left:20px;list-style:disc;color:rgba(180,200,210,0.75)">${match}</ul>`
  );
  html = html.replace(
    /\n\n+/g,
    '</p><p style="margin:10px 0;line-height:1.7">'
  );
  html = `<p style="margin:10px 0;line-height:1.7">${html}</p>`;
  return html;
}
function MarkdownViewer() {
  const [md, setMd] = reactExports.useState(DEFAULT_MD);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: { background: "rgba(11,15,18,0.6)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col border-r",
        style: { borderColor: "rgba(42,58,66,0.8)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-3 py-1.5 border-b flex-shrink-0",
              style: {
                borderColor: "rgba(42,58,66,0.5)",
                background: "rgba(10,16,20,0.5)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] uppercase tracking-widest font-semibold",
                  style: { color: "rgba(245,158,11,0.6)" },
                  children: "Markdown"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: md,
              onChange: (e) => setMd(e.target.value),
              "data-ocid": "markdown.editor",
              spellCheck: false,
              className: "flex-1 w-full p-4 text-xs bg-transparent outline-none resize-none leading-relaxed font-mono",
              style: {
                color: "rgba(180,200,210,0.8)",
                caretColor: "rgba(245,158,11,0.9)"
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-3 py-1.5 border-b flex-shrink-0",
          style: {
            borderColor: "rgba(42,58,66,0.5)",
            background: "rgba(10,16,20,0.5)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] uppercase tracking-widest font-semibold",
              style: { color: "rgba(39,215,224,0.6)" },
              children: "Preview"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex-1 overflow-y-auto p-4 text-xs",
          style: { color: "rgba(180,200,210,0.75)" },
          dangerouslySetInnerHTML: { __html: renderMarkdown(md) }
        }
      )
    ] })
  ] });
}
export {
  MarkdownViewer
};

import { r as reactExports, j as jsxRuntimeExports, F as FileText, C as Check, g as ue } from "./index-CZGIn5x2.js";
import { u as useCanisterKV } from "./useCanisterKV-Csa7Ywqc.js";
import { S as Save } from "./save-yx67L3vf.js";
import { C as ClipboardCopy } from "./clipboard-copy-BvnU9I1H.js";
const TEMPLATES = [
  {
    id: "email",
    name: "Email",
    icon: "✉️",
    fields: [
      { key: "to", label: "To", placeholder: "Recipient name or role" },
      { key: "subject", label: "Subject", placeholder: "Email subject" },
      {
        key: "context",
        label: "Context",
        placeholder: "What is this email about?"
      },
      {
        key: "action",
        label: "Call to Action",
        placeholder: "What should the recipient do?"
      },
      {
        key: "tone",
        label: "Tone",
        placeholder: "e.g. Professional, Friendly, Urgent"
      }
    ],
    generate: (f) => `Subject: ${f.subject || "(no subject)"}

Dear ${f.to || "[Recipient]"},

I hope this message finds you well. I'm writing to ${f.context || "discuss an important matter"}.

${f.action ? `I would greatly appreciate it if you could ${f.action}.` : ""}

Please don't hesitate to reach out if you have any questions.

${f.tone === "Friendly" ? "Thanks so much" : "Best regards"},
[Your Name]`
  },
  {
    id: "blog",
    name: "Blog Post",
    icon: "📝",
    fields: [
      { key: "title", label: "Title", placeholder: "Post title" },
      {
        key: "audience",
        label: "Target Audience",
        placeholder: "Who is this for?"
      },
      {
        key: "mainPoint",
        label: "Main Point",
        placeholder: "Core message or argument"
      },
      {
        key: "keyPoints",
        label: "Key Points",
        placeholder: "3-5 key points (comma separated)"
      },
      {
        key: "cta",
        label: "Call to Action",
        placeholder: "What should readers do next?"
      }
    ],
    generate: (f) => {
      const points = (f.keyPoints || "").split(",").map((p) => p.trim()).filter(Boolean);
      return `# ${f.title || "Untitled Post"}

*Written for: ${f.audience || "general readers"}*

## Introduction

${f.mainPoint || "[Main point goes here]"}

## Key Takeaways

${points.map((p, i) => `${i + 1}. ${p}`).join("\n") || "- [Point 1]\n- [Point 2]\n- [Point 3]"}

## Conclusion

${f.cta ? `**Next step:** ${f.cta}` : "[Conclusion goes here]"}`;
    }
  },
  {
    id: "cover",
    name: "Cover Letter",
    icon: "📄",
    fields: [
      { key: "company", label: "Company", placeholder: "Company name" },
      {
        key: "role",
        label: "Role",
        placeholder: "Position you're applying for"
      },
      {
        key: "experience",
        label: "Your Experience",
        placeholder: "Brief summary of relevant experience"
      },
      {
        key: "achievement",
        label: "Key Achievement",
        placeholder: "One impressive accomplishment"
      },
      {
        key: "why",
        label: "Why This Company",
        placeholder: "Why do you want to work here?"
      }
    ],
    generate: (f) => `Dear Hiring Manager at ${f.company || "[Company]"},

I am writing to express my strong interest in the ${f.role || "[Position]"} role at ${f.company || "[Company]"}.

${f.experience || "[Your experience summary]"}

One achievement I'm particularly proud of: ${f.achievement || "[Your achievement]"}

${f.why ? `I am specifically drawn to ${f.company} because ${f.why}.` : ""}

I am excited about the opportunity to contribute to your team and would welcome the chance to discuss how my background aligns with your needs.

Sincerely,
[Your Name]`
  },
  {
    id: "agenda",
    name: "Meeting Agenda",
    icon: "📋",
    fields: [
      {
        key: "title",
        label: "Meeting Title",
        placeholder: "e.g. Q4 Planning Session"
      },
      { key: "date", label: "Date & Time", placeholder: "e.g. Tuesday, 2pm" },
      {
        key: "attendees",
        label: "Attendees",
        placeholder: "Names or roles (comma separated)"
      },
      {
        key: "items",
        label: "Agenda Items",
        placeholder: "Topics to cover (comma separated)"
      },
      {
        key: "goal",
        label: "Meeting Goal",
        placeholder: "What should we accomplish?"
      }
    ],
    generate: (f) => {
      const attendees = (f.attendees || "").split(",").map((a) => a.trim()).filter(Boolean);
      const items = (f.items || "").split(",").map((i) => i.trim()).filter(Boolean);
      return `# ${f.title || "Meeting Agenda"}
📅 ${f.date || "[Date & Time]"}

**Goal:** ${f.goal || "[Meeting objective]"}

**Attendees:** ${attendees.join(", ") || "[Attendees]"}

---

## Agenda

${items.map((item, i) => `${i + 1}. ${item}`).join("\n") || "1. [Topic 1]\n2. [Topic 2]\n3. Action items & next steps"}

---
*Please come prepared to discuss your updates on each item.*`;
    }
  },
  {
    id: "product",
    name: "Product Description",
    icon: "🛍️",
    fields: [
      {
        key: "name",
        label: "Product Name",
        placeholder: "Product or service name"
      },
      {
        key: "audience",
        label: "Target Customer",
        placeholder: "Who is this for?"
      },
      {
        key: "problem",
        label: "Problem Solved",
        placeholder: "What pain point does it address?"
      },
      {
        key: "features",
        label: "Key Features",
        placeholder: "Top features (comma separated)"
      },
      {
        key: "differentiator",
        label: "What Makes It Unique",
        placeholder: "Why choose this over alternatives?"
      }
    ],
    generate: (f) => {
      const features = (f.features || "").split(",").map((feat) => feat.trim()).filter(Boolean);
      return `## ${f.name || "Product Name"}

*Built for ${f.audience || "[target customers]"}*

**The Problem**
${f.problem || "[Problem statement]"}

**The Solution**
${f.name || "This product"} gives you everything you need to succeed:

${features.map((feat) => `✅ ${feat}`).join("\n") || "✅ [Feature 1]\n✅ [Feature 2]\n✅ [Feature 3]"}

**Why Choose Us**
${f.differentiator || "[Your unique value proposition]"}

---
*Ready to get started? Try it today.*`;
    }
  }
];
function AIWritingAssistant() {
  const [selectedTemplateId, setSelectedTemplateId] = reactExports.useState(TEMPLATES[0].id);
  const [fields, setFields] = reactExports.useState({});
  const [copied, setCopied] = reactExports.useState(false);
  const { data: drafts, set: saveDrafts } = useCanisterKV(
    "aiwriting_drafts",
    []
  );
  const template = TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0];
  const generated = template.generate(fields);
  reactExports.useEffect(() => {
    setFields({});
  }, [selectedTemplateId]);
  function handleCopy() {
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      ue.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2e3);
    });
  }
  function handleSave() {
    const draft = {
      id: `draft_${Date.now()}`,
      templateId: selectedTemplateId,
      fields,
      savedAt: Date.now()
    };
    saveDrafts([draft, ...drafts.slice(0, 9)]);
    ue.success("Draft saved ✓");
  }
  function loadDraft(draft) {
    setSelectedTemplateId(draft.templateId);
    setFields(draft.fields);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full overflow-hidden",
      style: {
        background: "var(--os-bg-app)",
        color: "var(--os-text-primary)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-3 border-b",
            style: { borderColor: "var(--os-border)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16, style: { color: "var(--os-accent)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-semibold text-sm",
                  style: { color: "var(--os-text-primary)" },
                  children: "AI Writing Assistant"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-2 border-b overflow-x-auto",
            style: { borderColor: "var(--os-border)", flexShrink: 0 },
            children: TEMPLATES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setSelectedTemplateId(t.id),
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                style: {
                  background: selectedTemplateId === t.id ? "var(--os-accent)" : "var(--os-bg-secondary)",
                  color: selectedTemplateId === t.id ? "var(--os-text-primary)" : "var(--os-text-secondary)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.icon }),
                  t.name
                ]
              },
              t.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col w-1/2 border-r overflow-y-auto",
              style: { borderColor: "var(--os-border)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", style: { color: "var(--os-text-muted)" }, children: [
                    "Fill in the fields below to generate your",
                    " ",
                    template.name.toLowerCase(),
                    "."
                  ] }),
                  template.fields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "block text-xs font-medium mb-1",
                        style: { color: "var(--os-text-secondary)" },
                        children: field.label
                      }
                    ),
                    field.key === "context" || field.key === "keyPoints" || field.key === "items" || field.key === "experience" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        rows: 3,
                        className: "w-full text-sm px-3 py-2 rounded-lg border resize-none outline-none focus:ring-1",
                        style: {
                          background: "var(--os-bg-secondary)",
                          color: "var(--os-text-primary)",
                          borderColor: "var(--os-border)"
                        },
                        placeholder: field.placeholder,
                        value: fields[field.key] ?? "",
                        onChange: (e) => setFields((prev) => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: `field-${field.key}`,
                        type: "text",
                        className: "w-full text-sm px-3 py-2 rounded-lg border outline-none",
                        style: {
                          background: "var(--os-bg-secondary)",
                          color: "var(--os-text-primary)",
                          borderColor: "var(--os-border)"
                        },
                        placeholder: field.placeholder,
                        value: fields[field.key] ?? "",
                        onChange: (e) => setFields((prev) => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))
                      }
                    )
                  ] }, field.key))
                ] }),
                drafts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-medium mb-2",
                      style: { color: "var(--os-text-muted)" },
                      children: "Recent Drafts"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: drafts.slice(0, 4).map((draft) => {
                    const tmpl = TEMPLATES.find((t) => t.id === draft.templateId);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => loadDraft(draft),
                        className: "w-full text-left text-xs px-2 py-1.5 rounded hover:opacity-80 transition-opacity",
                        style: {
                          background: "var(--os-bg-secondary)",
                          color: "var(--os-text-secondary)"
                        },
                        children: [
                          tmpl == null ? void 0 : tmpl.icon,
                          " ",
                          tmpl == null ? void 0 : tmpl.name,
                          " —",
                          " ",
                          new Date(draft.savedAt).toLocaleDateString()
                        ]
                      },
                      draft.id
                    );
                  }) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-4 py-2 border-b",
                style: { borderColor: "var(--os-border)", flexShrink: 0 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-medium",
                      style: { color: "var(--os-text-muted)" },
                      children: "Preview"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleSave,
                        className: "flex items-center gap-1 text-xs px-2 py-1 rounded transition-opacity hover:opacity-80",
                        style: {
                          background: "var(--os-bg-secondary)",
                          color: "var(--os-text-secondary)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 12 }),
                          "Save"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleCopy,
                        className: "flex items-center gap-1 text-xs px-2 py-1 rounded transition-opacity hover:opacity-80",
                        style: {
                          background: copied ? "#22c55e22" : "var(--os-accent)",
                          color: "var(--os-text-primary)"
                        },
                        children: [
                          copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { size: 12 }),
                          copied ? "Copied!" : "Copy"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "pre",
              {
                className: "text-sm leading-relaxed whitespace-pre-wrap font-mono",
                style: { color: "var(--os-text-primary)" },
                children: generated
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
export {
  AIWritingAssistant as default
};

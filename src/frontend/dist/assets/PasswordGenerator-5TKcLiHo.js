import { r as reactExports, j as jsxRuntimeExports, R as RefreshCw, n as Copy, T as Trash2, g as ue } from "./index-8tMpYjTW.js";
import { B as Badge } from "./badge-DoqMcUVj.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { I as Input } from "./input-CCQCx2Ry.js";
import { S as Slider } from "./slider-BsZIaCwu.js";
import { S as Shield } from "./shield-DHJOVrKO.js";
import "./utils-CLTBVgOB.js";
import "./index-Dt4skXFn.js";
import "./index-IXOTxK3N.js";
import "./index-Bh3wJO-k.js";
import "./index-H3VjlnDK.js";
import "./index-DQZl7YVg.js";
import "./index-BeS__rWb.js";
import "./index-Bn6t7Tej.js";
import "./index-DQsGwgle.js";
import "./index-D9DFwgcF.js";
const BG = "rgba(11,15,18,0.7)";
const BORDER = "var(--os-text-muted)";
const CYAN = "var(--os-accent)";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMS = "0123456789";
const SYMS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
function generatePassword(length, upper, lower, nums, syms) {
  let charset = "";
  if (upper) charset += UPPER;
  if (lower) charset += LOWER;
  if (nums) charset += NUMS;
  if (syms) charset += SYMS;
  if (!charset) charset = LOWER;
  let pw = "";
  const required = [];
  if (upper) required.push(UPPER[Math.floor(Math.random() * UPPER.length)]);
  if (lower) required.push(LOWER[Math.floor(Math.random() * LOWER.length)]);
  if (nums) required.push(NUMS[Math.floor(Math.random() * NUMS.length)]);
  if (syms) required.push(SYMS[Math.floor(Math.random() * SYMS.length)]);
  for (let i = required.length; i < length; i++) {
    pw += charset[Math.floor(Math.random() * charset.length)];
  }
  const all = (pw + required.join("")).split("");
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.join("").slice(0, length);
}
function calcStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 14) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { score, label: "Weak", color: "rgb(239,68,68)" };
  if (score <= 3) return { score, label: "Fair", color: "rgb(234,179,8)" };
  if (score <= 4) return { score, label: "Strong", color: "rgb(34,197,94)" };
  return { score, label: "Very Strong", color: "var(--os-accent)" };
}
function PasswordGenerator({
  windowProps: _w
}) {
  const [length, setLength] = reactExports.useState(16);
  const [upper, setUpper] = reactExports.useState(true);
  const [lower, setLower] = reactExports.useState(true);
  const [nums, setNums] = reactExports.useState(true);
  const [syms, setSyms] = reactExports.useState(false);
  const [password, setPassword] = reactExports.useState("");
  const [history, setHistory] = reactExports.useState([]);
  const strength = reactExports.useMemo(() => calcStrength(password), [password]);
  const generate = reactExports.useCallback(() => {
    const pw = generatePassword(length, upper, lower, nums, syms);
    setPassword(pw);
    setHistory((prev) => [pw, ...prev.filter((p) => p !== pw)].slice(0, 10));
  }, [length, upper, lower, nums, syms]);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      ue.success("Copied to clipboard!", { duration: 1500 });
    });
  };
  const ToggleBtn = ({
    label,
    active,
    onClick
  }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
      style: {
        background: active ? "rgba(39,215,224,0.15)" : "var(--os-border-subtle)",
        border: `1px solid ${active ? "rgba(39,215,224,0.4)" : BORDER}`,
        color: active ? CYAN : "var(--os-text-secondary)"
      },
      children: label
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "passwordgenerator.panel",
      className: "flex flex-col h-full",
      style: { background: BG, color: "var(--os-text-primary)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-3 shrink-0",
            style: { borderBottom: `1px solid ${BORDER}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4", style: { color: "var(--os-accent)" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Password Generator" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60", children: "Password Length" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs",
                  style: {
                    borderColor: "rgba(39,215,224,0.3)",
                    color: "var(--os-accent)"
                  },
                  children: length
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                min: 8,
                max: 64,
                step: 1,
                value: [length],
                onValueChange: ([v]) => setLength(v),
                "data-ocid": "passwordgenerator.toggle",
                className: "w-full"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60 mb-2", children: "Character Types" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  label: "Uppercase A-Z",
                  active: upper,
                  onClick: () => setUpper(!upper)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  label: "Lowercase a-z",
                  active: lower,
                  onClick: () => setLower(!lower)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  label: "Numbers 0-9",
                  active: nums,
                  onClick: () => setNums(!nums)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ToggleBtn,
                {
                  label: "Symbols !@#",
                  active: syms,
                  onClick: () => setSyms(!syms)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: generate,
              "data-ocid": "passwordgenerator.primary_button",
              className: "w-full h-9 text-sm font-semibold",
              style: {
                background: "rgba(39,215,224,0.2)",
                color: "var(--os-accent)",
                border: "1px solid rgba(39,215,224,0.4)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                " Generate Password"
              ]
            }
          ),
          password && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-4 space-y-3",
              style: {
                background: "rgba(39,215,224,0.05)",
                border: "1px solid rgba(39,215,224,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: password,
                      readOnly: true,
                      "data-ocid": "passwordgenerator.input",
                      className: "flex-1 h-9 font-mono text-sm",
                      style: {
                        background: "var(--os-border-subtle)",
                        border: `1px solid ${BORDER}`,
                        color: "var(--os-text-primary)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "icon",
                      onClick: () => copyToClipboard(password),
                      "data-ocid": "passwordgenerator.secondary_button",
                      className: "h-9 w-9 shrink-0",
                      style: {
                        background: "rgba(39,215,224,0.15)",
                        border: "1px solid rgba(39,215,224,0.3)",
                        color: "var(--os-accent)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "Strength" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: strength.color }, children: strength.label })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-1.5 rounded-full overflow-hidden",
                      style: { background: "var(--os-text-muted)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "h-full rounded-full transition-all duration-300",
                          style: {
                            width: `${strength.score / 6 * 100}%`,
                            background: strength.color
                          }
                        }
                      )
                    }
                  )
                ] })
              ]
            }
          ),
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/60", children: "Recent Passwords" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setHistory([]),
                  "data-ocid": "passwordgenerator.delete_button",
                  className: "text-xs text-muted-foreground/60 hover:text-red-400 transition-colors flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                    " Clear"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: history.map((pw, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `passwordgenerator.item.${i + 1}`,
                className: "flex items-center gap-2 group rounded px-2 py-1",
                style: { background: "var(--os-border-subtle)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-mono text-xs text-muted-foreground truncate", children: pw }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => copyToClipboard(pw),
                      className: "opacity-0 group-hover:opacity-100 transition-opacity",
                      style: { color: "rgba(39,215,224,0.7)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
                    }
                  )
                ]
              },
              `hist-${pw.slice(0, 8)}-${i}`
            )) })
          ] })
        ] })
      ]
    }
  );
}
export {
  PasswordGenerator
};

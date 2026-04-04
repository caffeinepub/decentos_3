import { r as reactExports, j as jsxRuntimeExports, C as Check, n as Copy, g as ue } from "./index-8tMpYjTW.js";
import { B as Button } from "./button-BMA-bo_z.js";
import { u as useComposedRefs, c as cn } from "./utils-CLTBVgOB.js";
import { c as createContextScope } from "./index-H3VjlnDK.js";
import { c as composeEventHandlers } from "./index-Bh3wJO-k.js";
import { u as useControllableState } from "./index-DQZl7YVg.js";
import { u as usePrevious, a as useSize } from "./index-Bn6t7Tej.js";
import { P as Presence } from "./index-BlmlyJvC.js";
import { P as Primitive } from "./index-DQsGwgle.js";
import { L as Label } from "./label-xLJeJUmj.js";
import "./index-Dt4skXFn.js";
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
const PRESETS = [
  {
    label: "Email",
    pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    description: "Email address"
  },
  {
    label: "URL",
    pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*",
    flags: "gi",
    description: "HTTP/HTTPS URL"
  },
  {
    label: "Phone",
    pattern: "[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,3}[-\\s.]?[0-9]{4,6}",
    flags: "g",
    description: "Phone number"
  },
  {
    label: "Date",
    pattern: "\\d{1,2}[\\/\\-\\.]\\d{1,2}[\\/\\-\\.]\\d{2,4}",
    flags: "g",
    description: "Date (various formats)"
  },
  {
    label: "IPv4",
    pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b",
    flags: "g",
    description: "IPv4 address"
  },
  {
    label: "Hex Color",
    pattern: "#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b",
    flags: "g",
    description: "Hex color code"
  },
  {
    label: "JSON Key",
    pattern: '"([^"]+)"\\s*:',
    flags: "g",
    description: "JSON object key"
  },
  {
    label: "Numbers",
    pattern: "-?\\d+(\\.\\d+)?",
    flags: "g",
    description: "Integer or decimal"
  }
];
function RegexTester({ windowProps: _windowProps }) {
  const [pattern, setPattern] = reactExports.useState("");
  const [flags, setFlags] = reactExports.useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = reactExports.useState("");
  const [showPresets, setShowPresets] = reactExports.useState(false);
  const toggleFlag = (f) => {
    setFlags((prev) => ({ ...prev, [f]: !prev[f] }));
  };
  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
  const applyPreset = (preset) => {
    setPattern(preset.pattern);
    const pFlags = { g: false, i: false, m: false, s: false };
    for (const f of preset.flags) {
      if (f in pFlags) pFlags[f] = true;
    }
    setFlags(pFlags);
    setShowPresets(false);
    ue.success(`Preset applied: ${preset.label}`);
  };
  const copyPattern = () => {
    if (!pattern) {
      ue.error("No pattern to copy");
      return;
    }
    navigator.clipboard.writeText(`/${pattern}/${flagStr}`);
    ue.success("Pattern copied");
  };
  const { highlighted, matches, error } = reactExports.useMemo(() => {
    if (!pattern || !testString) {
      return {
        highlighted: testString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        matches: [],
        error: ""
      };
    }
    try {
      new RegExp(pattern, flagStr);
      const found = [];
      let lastIndex = 0;
      const parts = [];
      const safeRe = new RegExp(
        pattern,
        flagStr.includes("g") ? flagStr : `${flagStr}g`
      );
      let m = safeRe.exec(testString);
      while (m !== null) {
        if (m.index > lastIndex)
          parts.push({
            text: testString.slice(lastIndex, m.index),
            isMatch: false
          });
        parts.push({ text: m[0], isMatch: true });
        found.push(m[0]);
        lastIndex = safeRe.lastIndex;
        if (!flagStr.includes("g")) break;
        if (m[0].length === 0) safeRe.lastIndex++;
        m = safeRe.exec(testString);
      }
      if (lastIndex < testString.length)
        parts.push({ text: testString.slice(lastIndex), isMatch: false });
      if (parts.length === 0) parts.push({ text: testString, isMatch: false });
      const html = parts.map(
        (p) => p.isMatch ? `<mark style="background:rgba(39,215,224,0.28);color:rgba(39,215,224,1);border-radius:3px;padding:0 2px">${p.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</mark>` : p.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      ).join("");
      return { highlighted: html, matches: found, error: "" };
    } catch (e) {
      return {
        highlighted: testString.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        matches: [],
        error: e instanceof Error ? e.message : "Invalid regex"
      };
    }
  }, [pattern, flagStr, testString]);
  const inputBorder = (hasError) => ({
    borderColor: hasError ? "rgba(239,68,68,0.5)" : "rgba(39,215,224,0.2)"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "regextester.panel",
      className: "flex flex-col h-full text-foreground overflow-hidden",
      style: {
        background: "rgba(11,15,18,0.6)",
        padding: 12,
        gap: 10,
        display: "flex",
        flexDirection: "column"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-sm font-semibold",
              style: { color: "rgb(39,215,224)" },
              children: "Regex Tester"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-6 text-[10px] px-2",
                onClick: () => setShowPresets((v) => !v),
                "data-ocid": "regextester.secondary_button",
                style: { color: showPresets ? "rgb(39,215,224)" : void 0 },
                children: "Presets"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-6 text-[10px] px-2 gap-0.5",
                onClick: copyPattern,
                "data-ocid": "regextester.primary_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-2.5 h-2.5" }),
                  " Copy"
                ]
              }
            )
          ] })
        ] }),
        showPresets && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "regextester.popover",
            className: "rounded-lg p-2 flex-shrink-0 grid grid-cols-2 gap-1",
            style: {
              background: "rgba(20,32,42,0.8)",
              border: "1px solid rgba(39,215,224,0.15)"
            },
            children: PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => applyPreset(p),
                title: p.description,
                className: "text-left px-2 py-1.5 rounded text-xs transition-all hover:bg-white/5",
                style: {
                  border: "1px solid rgba(39,215,224,0.1)",
                  color: "var(--os-text-primary)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-medium",
                      style: { color: "rgb(39,215,224)" },
                      children: p.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "block text-[10px] truncate",
                      style: { color: "var(--os-text-muted)" },
                      children: p.description
                    }
                  )
                ]
              },
              p.label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-sm font-mono",
              style: { color: "var(--os-text-muted)" },
              children: "/"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "data-ocid": "regextester.input",
              value: pattern,
              onChange: (e) => setPattern(e.target.value),
              placeholder: "enter pattern",
              className: "flex-1 bg-transparent border rounded px-2 py-1 text-sm outline-none text-foreground font-mono",
              style: { ...inputBorder(!!error), background: "rgba(20,32,42,0.6)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-sm font-mono",
              style: { color: "var(--os-text-muted)" },
              children: "/"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-sm font-mono w-6",
              style: { color: "rgba(39,215,224,0.8)" },
              children: flagStr
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-shrink-0", children: [
          ["g", "i", "m", "s"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: `flag-${f}`,
                checked: flags[f],
                onCheckedChange: () => toggleFlag(f)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: `flag-${f}`,
                className: "text-xs cursor-pointer",
                style: { color: "#aaa" },
                children: f
              }
            )
          ] }, f)),
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              "data-ocid": "regextester.error_state",
              className: "text-xs ml-auto",
              style: { color: "#f87171" },
              children: [
                "⚠ ",
                error
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[10px] font-medium uppercase tracking-wider",
              style: { color: "var(--os-text-muted)" },
              children: "Test String"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              "data-ocid": "regextester.textarea",
              value: testString,
              onChange: (e) => setTestString(e.target.value),
              placeholder: "Enter text to test against...",
              className: "resize-none rounded p-2 text-sm outline-none text-foreground bg-transparent",
              style: {
                border: "1px solid rgba(39,215,224,0.15)",
                background: "rgba(20,32,42,0.6)",
                minHeight: 72,
                fontFamily: "monospace"
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-1 min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-[10px] font-medium uppercase tracking-wider",
                style: { color: "var(--os-text-muted)" },
                children: "Result"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px] font-mono",
                style: {
                  color: matches.length > 0 ? "rgb(39,215,224)" : "var(--os-text-muted)"
                },
                children: [
                  matches.length,
                  " match",
                  matches.length !== 1 ? "es" : ""
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded p-2 text-sm overflow-auto flex-1 whitespace-pre-wrap break-all",
              style: {
                border: "1px solid rgba(39,215,224,0.12)",
                background: "rgba(20,32,42,0.5)",
                fontFamily: "monospace",
                minHeight: 48
              },
              dangerouslySetInnerHTML: { __html: highlighted }
            }
          )
        ] }),
        matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-[10px] font-medium uppercase tracking-wider",
              style: { color: "var(--os-text-muted)" },
              children: "Matches"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
            matches.slice(0, 50).map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `regextester.item.${i + 1}`,
                className: "px-2 py-0.5 rounded text-xs font-mono cursor-pointer transition-all hover:opacity-80",
                style: {
                  background: "rgba(39,215,224,0.12)",
                  color: "rgb(39,215,224)",
                  border: "1px solid rgba(39,215,224,0.25)"
                },
                onClick: () => {
                  navigator.clipboard.writeText(m);
                  ue.success("Copied");
                },
                title: "Click to copy",
                children: m || "(empty)"
              },
              i
            )),
            matches.length > 50 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", style: { color: "#666" }, children: [
              "+",
              matches.length - 50,
              " more"
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  RegexTester
};

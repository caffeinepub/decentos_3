import { r as reactExports, j as jsxRuntimeExports, au as QrCode, g as ue } from "./index-CZGIn5x2.js";
import { B as Button } from "./button-DBwl-7M-.js";
import { I as Input } from "./input-C2UuKq0p.js";
import { L as Label } from "./label-CGkVOZPp.js";
import { D as Download } from "./download-CRM1KdTk.js";
import "./utils-C29Fbx4G.js";
import "./index-B265m3O3.js";
import "./index-B9-lQkRo.js";
function buildQrUrl(text, size = 240) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=27D7E0&bgcolor=0b0f12&margin=10&format=png`;
}
function QrCodeGenerator(_) {
  const [text, setText] = reactExports.useState("https://decentos.icp");
  const [qrUrl, setQrUrl] = reactExports.useState(() => buildQrUrl("https://decentos.icp"));
  const [generated, setGenerated] = reactExports.useState(true);
  const [loading, setLoading] = reactExports.useState(false);
  const handleGenerate = () => {
    if (!text.trim()) {
      ue.error("Enter some text or URL");
      return;
    }
    setLoading(true);
    setGenerated(false);
    setQrUrl(buildQrUrl(text));
  };
  const downloadPng = async () => {
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      ue.success("QR code downloaded");
    } catch {
      ue.error("Download failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full flex-col items-center gap-6 p-6",
      style: { background: "rgba(11,15,18,0.7)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full max-w-sm flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground/60", children: "Text or URL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "qrcode.input",
                value: text,
                onChange: (e) => setText(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleGenerate(),
                placeholder: "https://example.com",
                className: "border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/60"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "qrcode.primary_button",
                onClick: handleGenerate,
                style: { background: "var(--os-accent)", color: "#000" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-center rounded-2xl border border-border p-6",
            style: {
              background: "rgba(11,15,28,0.8)",
              minWidth: 276,
              minHeight: 276
            },
            children: [
              loading && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-xs text-muted-foreground/60",
                  "data-ocid": "qrcode.loading_state",
                  children: "Generating…"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: qrUrl,
                  alt: "QR code",
                  width: 240,
                  height: 240,
                  style: {
                    display: loading ? "none" : "block",
                    imageRendering: "pixelated"
                  },
                  onLoad: () => {
                    setLoading(false);
                    setGenerated(true);
                  },
                  onError: () => {
                    setLoading(false);
                    ue.error("QR generation failed — check your connection");
                  }
                }
              )
            ]
          }
        ),
        generated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "qrcode.secondary_button",
            variant: "outline",
            className: "border-border text-foreground hover:bg-muted/50",
            onClick: downloadPng,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              " Download PNG"
            ]
          }
        )
      ]
    }
  );
}
export {
  QrCodeGenerator
};

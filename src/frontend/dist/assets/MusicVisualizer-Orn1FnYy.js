import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ah as Music } from "./index-CZGIn5x2.js";
import { S as Square } from "./square-ClZfPILt.js";
import { P as Play } from "./play-BWBgGvVq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M18.89 13.23A7.12 7.12 0 0 0 19 12v-2", key: "80xlxr" }],
  ["path", { d: "M5 10v2a7 7 0 0 0 12 5", key: "p2k8kg" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }]
];
const MicOff = createLucideIcon("mic-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", key: "131961" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }]
];
const Mic = createLucideIcon("mic", __iconNode);
const BTN = {
  base: {
    background: "rgba(39,215,224,0.1)",
    border: "1px solid rgba(39,215,224,0.3)",
    color: "var(--os-accent)"
  },
  active: {
    background: "rgba(39,215,224,0.25)",
    border: "1px solid rgba(39,215,224,0.6)",
    color: "var(--os-accent)"
  },
  muted: {
    background: "transparent",
    border: "1px solid var(--os-text-muted)",
    color: "var(--os-text-secondary)"
  }
};
function stopMediaTracks(stream) {
  for (const track of stream.getTracks()) {
    track.stop();
  }
}
function MusicVisualizer() {
  const canvasRef = reactExports.useRef(null);
  const ctxRef = reactExports.useRef(null);
  const analyserRef = reactExports.useRef(null);
  const oscillatorRef = reactExports.useRef(null);
  const gainRef = reactExports.useRef(null);
  const micStreamRef = reactExports.useRef(null);
  const micSourceRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(0);
  const [playing, setPlaying] = reactExports.useState(false);
  const [micActive, setMicActive] = reactExports.useState(false);
  const [micError, setMicError] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("bars");
  const [frequency, setFrequency] = reactExports.useState(440);
  const [volume, setVolume] = reactExports.useState(0.3);
  const stopAnim = reactExports.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);
  const drawFrame = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(8,12,18,0.95)";
    ctx.fillRect(0, 0, W, H);
    if (mode === "bars") {
      analyser.getByteFrequencyData(data);
      const barW = W / bufLen * 2.5;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const barH = data[i] / 255 * H * 0.9;
        const hue = i / bufLen * 240 + 180;
        const grad = ctx.createLinearGradient(0, H - barH, 0, H);
        grad.addColorStop(0, `hsla(${hue},100%,70%,0.9)`);
        grad.addColorStop(1, `hsla(${hue},100%,40%,0.4)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, H - barH, barW - 1, barH);
        x += barW;
      }
    } else if (mode === "waveform") {
      analyser.getByteTimeDomainData(data);
      ctx.lineWidth = 2;
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "#27D7E0");
      grad.addColorStop(0.5, "#7C3AED");
      grad.addColorStop(1, "#27D7E0");
      ctx.strokeStyle = grad;
      ctx.shadowColor = "#27D7E0";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      const sliceW = W / bufLen;
      let x2 = 0;
      for (let i = 0; i < bufLen; i++) {
        const v = data[i] / 128;
        const y = v * H / 2;
        if (i === 0) ctx.moveTo(x2, y);
        else ctx.lineTo(x2, y);
        x2 += sliceW;
      }
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      analyser.getByteFrequencyData(data);
      const cx = W / 2;
      const cy = H / 2;
      const radius = Math.min(W, H) * 0.3;
      for (let i = 0; i < bufLen; i++) {
        const angle = i / bufLen * Math.PI * 2 - Math.PI / 2;
        const amp = data[i] / 255 * radius * 0.8;
        const inner = radius;
        const outer = radius + amp;
        const hue = i / bufLen * 240 + 180;
        ctx.strokeStyle = `hsla(${hue},100%,65%,0.85)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(39,215,224,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    rafRef.current = requestAnimationFrame(drawFrame);
  }, [mode]);
  const startAudio = reactExports.useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ac = ctxRef.current;
    if (ac.state === "suspended") ac.resume();
    const analyser = ac.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    const gain = ac.createGain();
    gain.gain.value = volume;
    gainRef.current = gain;
    const osc = ac.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    oscillatorRef.current = osc;
    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(ac.destination);
    osc.start();
    rafRef.current = requestAnimationFrame(drawFrame);
    setPlaying(true);
  }, [frequency, volume, drawFrame]);
  const stopAudio = reactExports.useCallback(() => {
    var _a, _b, _c, _d;
    (_a = oscillatorRef.current) == null ? void 0 : _a.stop();
    (_b = oscillatorRef.current) == null ? void 0 : _b.disconnect();
    oscillatorRef.current = null;
    (_c = gainRef.current) == null ? void 0 : _c.disconnect();
    gainRef.current = null;
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    if (micStreamRef.current) {
      stopMediaTracks(micStreamRef.current);
      micStreamRef.current = null;
    }
    (_d = analyserRef.current) == null ? void 0 : _d.disconnect();
    analyserRef.current = null;
    stopAnim();
    setPlaying(false);
    setMicActive(false);
  }, [stopAnim]);
  const toggleMic = reactExports.useCallback(async () => {
    if (micActive) {
      if (micSourceRef.current) {
        micSourceRef.current.disconnect();
        micSourceRef.current = null;
      }
      if (micStreamRef.current) {
        stopMediaTracks(micStreamRef.current);
        micStreamRef.current = null;
      }
      setMicActive(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      if (!analyserRef.current) {
        const analyser = ctxRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        analyser.connect(ctxRef.current.destination);
      }
      const src = ctxRef.current.createMediaStreamSource(stream);
      src.connect(analyserRef.current);
      micSourceRef.current = src;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
      setMicActive(true);
      setMicError("");
    } catch {
      setMicError("Mic access denied");
    }
  }, [micActive, drawFrame]);
  reactExports.useEffect(() => {
    if (oscillatorRef.current)
      oscillatorRef.current.frequency.value = frequency;
  }, [frequency]);
  reactExports.useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obs = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    obs.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => obs.disconnect();
  }, []);
  reactExports.useEffect(() => {
    if (playing || micActive) {
      stopAnim();
      rafRef.current = requestAnimationFrame(drawFrame);
    }
  }, [playing, micActive, drawFrame, stopAnim]);
  reactExports.useEffect(() => () => stopAudio(), [stopAudio]);
  const MODES = [
    { id: "bars", label: "Bars" },
    { id: "waveform", label: "Wave" },
    { id: "circular", label: "Radial" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full",
      style: { background: "rgba(8,12,18,0.97)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-shrink-0 flex flex-wrap items-center gap-3 px-3 py-2",
            style: {
              borderBottom: "1px solid rgba(39,215,224,0.15)",
              background: "rgba(10,16,22,0.95)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "w-4 h-4", style: { color: "var(--os-accent)" } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs font-semibold tracking-wider",
                    style: { color: "var(--os-accent)" },
                    children: "VISUALIZER"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: MODES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setMode(m.id),
                  "data-ocid": `musicvis.${m.id}.tab`,
                  className: "px-2 py-1 rounded text-[10px] font-medium transition-all",
                  style: mode === m.id ? BTN.active : BTN.muted,
                  children: m.label
                },
                m.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Freq"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 80,
                    max: 2e3,
                    value: frequency,
                    onChange: (e) => setFrequency(Number(e.target.value)),
                    "data-ocid": "musicvis.frequency.input",
                    className: "w-20 h-1 accent-cyan-400"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[10px] font-mono w-10",
                    style: { color: "var(--os-text-secondary)" },
                    children: [
                      frequency,
                      "Hz"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px]",
                    style: { color: "var(--os-text-secondary)" },
                    children: "Vol"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: volume,
                    onChange: (e) => setVolume(Number(e.target.value)),
                    "data-ocid": "musicvis.volume.input",
                    className: "w-16 h-1 accent-cyan-400"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: playing ? stopAudio : startAudio,
                  "data-ocid": "musicvis.play.toggle",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
                  style: playing ? BTN.active : BTN.base,
                  children: [
                    playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3" }),
                    playing ? "Stop" : "Play Tone"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: toggleMic,
                  "data-ocid": "musicvis.mic.toggle",
                  className: "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
                  style: micActive ? BTN.active : BTN.muted,
                  title: micError || "Toggle microphone input",
                  children: [
                    micActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "w-3 h-3" }),
                    micError ? "Mic denied" : micActive ? "Mic On" : "Use Mic"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              "data-ocid": "musicvis.canvas_target",
              style: { width: "100%", height: "100%", display: "block" }
            }
          ),
          !playing && !micActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute inset-0 flex flex-col items-center justify-center gap-3",
              style: { pointerEvents: "none" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Music,
                  {
                    className: "w-12 h-12",
                    style: { color: "rgba(39,215,224,0.2)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm font-medium",
                    style: { color: "var(--os-text-muted)" },
                    children: "Press Play Tone or Use Mic to visualize audio"
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  MusicVisualizer
};

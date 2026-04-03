import { Mic, MicOff, Music, Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type VisMode = "bars" | "waveform" | "circular";

const BTN = {
  base: {
    background: "rgba(39,215,224,0.1)",
    border: "1px solid rgba(39,215,224,0.3)",
    color: "var(--os-accent)",
  },
  active: {
    background: "rgba(39,215,224,0.25)",
    border: "1px solid rgba(39,215,224,0.6)",
    color: "var(--os-accent)",
  },
  muted: {
    background: "transparent",
    border: "1px solid var(--os-text-muted)",
    color: "var(--os-text-secondary)",
  },
};

function stopMediaTracks(stream: MediaStream) {
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

export function MusicVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);

  const [playing, setPlaying] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState("");
  const [mode, setMode] = useState<VisMode>("bars");
  const [frequency, setFrequency] = useState(440);
  const [volume, setVolume] = useState(0.3);

  const stopAnim = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const drawFrame = useCallback(() => {
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
      const barW = (W / bufLen) * 2.5;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const barH = (data[i] / 255) * H * 0.9;
        const hue = (i / bufLen) * 240 + 180;
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
        const v = data[i] / 128.0;
        const y = (v * H) / 2;
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
        const angle = (i / bufLen) * Math.PI * 2 - Math.PI / 2;
        const amp = (data[i] / 255) * radius * 0.8;
        const inner = radius;
        const outer = radius + amp;
        const hue = (i / bufLen) * 240 + 180;
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

  const startAudio = useCallback(() => {
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

  const stopAudio = useCallback(() => {
    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    oscillatorRef.current = null;
    gainRef.current?.disconnect();
    gainRef.current = null;
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    if (micStreamRef.current) {
      stopMediaTracks(micStreamRef.current);
      micStreamRef.current = null;
    }
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    stopAnim();
    setPlaying(false);
    setMicActive(false);
  }, [stopAnim]);

  const toggleMic = useCallback(async () => {
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

  // Update oscillator frequency/volume live
  useEffect(() => {
    if (oscillatorRef.current)
      oscillatorRef.current.frequency.value = frequency;
  }, [frequency]);
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  // Resize canvas
  useEffect(() => {
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

  // Restart animation when drawFrame (incl. mode) or active state changes
  useEffect(() => {
    if (playing || micActive) {
      stopAnim();
      rafRef.current = requestAnimationFrame(drawFrame);
    }
  }, [playing, micActive, drawFrame, stopAnim]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const MODES: { id: VisMode; label: string }[] = [
    { id: "bars", label: "Bars" },
    { id: "waveform", label: "Wave" },
    { id: "circular", label: "Radial" },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "rgba(8,12,18,0.97)" }}
    >
      {/* Toolbar */}
      <div
        className="flex-shrink-0 flex flex-wrap items-center gap-3 px-3 py-2"
        style={{
          borderBottom: "1px solid rgba(39,215,224,0.15)",
          background: "rgba(10,16,22,0.95)",
        }}
      >
        <div className="flex items-center gap-1">
          <Music className="w-4 h-4" style={{ color: "var(--os-accent)" }} />
          <span
            className="text-xs font-semibold tracking-wider"
            style={{ color: "var(--os-accent)" }}
          >
            VISUALIZER
          </span>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              data-ocid={`musicvis.${m.id}.tab`}
              className="px-2 py-1 rounded text-[10px] font-medium transition-all"
              style={mode === m.id ? BTN.active : BTN.muted}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Frequency */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px]"
            style={{ color: "var(--os-text-secondary)" }}
          >
            Freq
          </span>
          <input
            type="range"
            min={80}
            max={2000}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            data-ocid="musicvis.frequency.input"
            className="w-20 h-1 accent-cyan-400"
          />
          <span
            className="text-[10px] font-mono w-10"
            style={{ color: "var(--os-text-secondary)" }}
          >
            {frequency}Hz
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px]"
            style={{ color: "var(--os-text-secondary)" }}
          >
            Vol
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            data-ocid="musicvis.volume.input"
            className="w-16 h-1 accent-cyan-400"
          />
        </div>

        {/* Play/Stop */}
        <button
          type="button"
          onClick={playing ? stopAudio : startAudio}
          data-ocid="musicvis.play.toggle"
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all"
          style={playing ? BTN.active : BTN.base}
        >
          {playing ? (
            <Square className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
          {playing ? "Stop" : "Play Tone"}
        </button>

        {/* Mic */}
        <button
          type="button"
          onClick={toggleMic}
          data-ocid="musicvis.mic.toggle"
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all"
          style={micActive ? BTN.active : BTN.muted}
          title={micError || "Toggle microphone input"}
        >
          {micActive ? (
            <Mic className="w-3 h-3" />
          ) : (
            <MicOff className="w-3 h-3" />
          )}
          {micError ? "Mic denied" : micActive ? "Mic On" : "Use Mic"}
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          data-ocid="musicvis.canvas_target"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        {!playing && !micActive && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ pointerEvents: "none" }}
          >
            <Music
              className="w-12 h-12"
              style={{ color: "rgba(39,215,224,0.2)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--os-text-muted)" }}
            >
              Press Play Tone or Use Mic to visualize audio
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

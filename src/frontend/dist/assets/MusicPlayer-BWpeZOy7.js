import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ah as Music } from "./index-CZGIn5x2.js";
import { S as Shuffle } from "./shuffle-Em6kcPHZ.js";
import { P as Pause } from "./pause-DCBkz2lW.js";
import { P as Play } from "./play-BWBgGvVq.js";
import { S as SkipForward } from "./skip-forward-Daen_Ive.js";
import { R as Repeat } from "./repeat-CO6b6mjw.js";
import { V as Volume2 } from "./volume-2-CgTRp1gQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "19 20 9 12 19 4 19 20", key: "o2sva" }],
  ["line", { x1: "5", x2: "5", y1: "19", y2: "5", key: "1ocqjk" }]
];
const SkipBack = createLucideIcon("skip-back", __iconNode);
function parseTrackInfo(file) {
  const base = file.name.replace(/\.[^.]+$/, "");
  const parts = base.split(" - ");
  if (parts.length >= 2) {
    return { artist: parts[0].trim(), name: parts.slice(1).join(" - ").trim() };
  }
  return { artist: "Unknown Artist", name: base };
}
function MusicPlayer() {
  const audioRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const [tracks, setTracks] = reactExports.useState([]);
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [duration, setDuration] = reactExports.useState(0);
  const [volume, setVolume] = reactExports.useState(0.8);
  const [shuffle, setShuffle] = reactExports.useState(false);
  const [repeat, setRepeat] = reactExports.useState(false);
  const currentTrack = tracks[currentIndex] ?? null;
  reactExports.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.url;
    audio.volume = volume;
    if (isPlaying) audio.play().catch(() => {
    });
  }, [currentIndex]);
  reactExports.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);
  const handleNext = reactExports.useCallback(() => {
    if (tracks.length === 0) return;
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    }
  }, [tracks.length, shuffle]);
  reactExports.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {
        });
      } else {
        handleNext();
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [repeat, handleNext]);
  const handlePrev = reactExports.useCallback(() => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);
  const handlePlayPause = reactExports.useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
      });
    }
  }, [isPlaying, currentTrack]);
  const handleProgressClick = reactExports.useCallback(
    (e) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * duration;
    },
    [duration]
  );
  const handleAddFiles = reactExports.useCallback(
    (e) => {
      const files = Array.from(e.target.files ?? []);
      const newTracks = files.map((f) => ({
        ...parseTrackInfo(f),
        url: URL.createObjectURL(f),
        file: f
      }));
      setTracks((prev) => [...prev, ...newTracks]);
      if (e.target) e.target.value = "";
    },
    []
  );
  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full bg-transparent text-foreground font-sans",
      "data-ocid": "musicplayer.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { ref: audioRef }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1 p-5 gap-4 overflow-hidden", children: [
          tracks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-1 flex flex-col items-center justify-center gap-3",
              "data-ocid": "musicplayer.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Music,
                  {
                    className: "w-14 h-14 opacity-20",
                    style: { color: "var(--os-accent)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Drop audio files to begin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      var _a;
                      return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                    },
                    "data-ocid": "musicplayer.upload_button",
                    className: "mt-2 px-4 py-2 text-xs rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors",
                    children: "+ Add Files"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "relative w-24 h-24 rounded-full flex items-center justify-center",
                  style: {
                    background: "radial-gradient(circle at 50% 50%, #1a1a2e 60%, #27D7E0 100%)",
                    boxShadow: isPlaying ? "0 0 24px rgba(39,215,224,0.6), 0 0 48px rgba(39,215,224,0.2)" : "0 0 8px rgba(0,0,0,0.5)",
                    animation: isPlaying ? "vinylSpin 3s linear infinite" : "none"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-full",
                      style: {
                        background: "var(--os-bg-app)",
                        border: "2px solid var(--os-accent)"
                      }
                    }
                  )
                }
              ),
              isPlaying && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1 h-8", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-1.5 rounded-sm",
                  style: {
                    background: "var(--os-accent)",
                    animation: `barPulse${i} ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                    height: "100%"
                  }
                },
                i
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate max-w-[220px]", children: currentTrack == null ? void 0 : currentTrack.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: currentTrack == null ? void 0 : currentTrack.artist })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-1.5 rounded-full cursor-pointer",
                  style: { background: "rgba(39,215,224,0.15)" },
                  onClick: handleProgressClick,
                  "data-ocid": "musicplayer.canvas_target",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all",
                      style: {
                        width: duration ? `${progress / duration * 100}%` : "0%",
                        background: "var(--os-accent)"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground font-mono", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmt(progress) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmt(duration) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShuffle((s) => !s),
                  "data-ocid": "musicplayer.toggle",
                  className: "p-1.5 rounded hover:bg-white/8 transition-colors",
                  style: { color: shuffle ? "#27D7E0" : void 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handlePrev,
                  "data-ocid": "musicplayer.secondary_button",
                  className: "p-1.5 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handlePlayPause,
                  "data-ocid": "musicplayer.primary_button",
                  className: "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105",
                  style: {
                    background: "var(--os-accent)",
                    color: "#0B0F12",
                    boxShadow: isPlaying ? "0 0 16px rgba(39,215,224,0.5)" : "none"
                  },
                  children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 ml-0.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleNext,
                  "data-ocid": "musicplayer.button",
                  className: "p-1.5 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRepeat((r) => !r),
                  "data-ocid": "musicplayer.secondary_button",
                  className: "p-1.5 rounded hover:bg-white/8 transition-colors",
                  style: { color: repeat ? "#27D7E0" : void 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "range",
                  min: 0,
                  max: 1,
                  step: 0.01,
                  value: volume,
                  onChange: (e) => setVolume(Number(e.target.value)),
                  "data-ocid": "musicplayer.input",
                  className: "flex-1 h-1 accent-cyan-400 cursor-pointer"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              accept: "audio/*",
              multiple: true,
              className: "hidden",
              onChange: handleAddFiles
            }
          ),
          tracks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              "data-ocid": "musicplayer.upload_button",
              className: "w-full py-1.5 text-xs rounded border border-cyan-500/30 text-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors mt-auto",
              children: "+ Add More Files"
            }
          )
        ] }),
        tracks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-48 flex flex-col border-l",
            style: { borderColor: "rgba(39,215,224,0.15)" },
            "data-ocid": "musicplayer.list",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "px-3 py-2 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground border-b",
                  style: { borderColor: "rgba(39,215,224,0.1)" },
                  children: "Playlist"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: tracks.map((track, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setCurrentIndex(i);
                    setTimeout(
                      () => {
                        var _a;
                        return (_a = audioRef.current) == null ? void 0 : _a.play().catch(() => {
                        });
                      },
                      50
                    );
                  },
                  "data-ocid": `musicplayer.item.${i + 1}`,
                  className: "w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5",
                  style: {
                    borderLeft: i === currentIndex ? "2px solid #27D7E0" : "2px solid transparent",
                    color: i === currentIndex ? "#27D7E0" : void 0
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-medium", children: track.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[10px] text-muted-foreground", children: track.artist })
                  ]
                },
                track.url
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes barPulse1 { from { height: 20%; } to { height: 80%; } }
        @keyframes barPulse2 { from { height: 40%; } to { height: 100%; } }
        @keyframes barPulse3 { from { height: 60%; } to { height: 30%; } }
        @keyframes barPulse4 { from { height: 20%; } to { height: 90%; } }
        @keyframes barPulse5 { from { height: 70%; } to { height: 40%; } }
      ` })
      ]
    }
  );
}
export {
  MusicPlayer
};

import {
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Track {
  name: string;
  artist: string;
  url: string;
  file: File;
}

function parseTrackInfo(file: File): { name: string; artist: string } {
  const base = file.name.replace(/\.[^.]+$/, "");
  const parts = base.split(" - ");
  if (parts.length >= 2) {
    return { artist: parts[0].trim(), name: parts.slice(1).join(" - ").trim() };
  }
  return { artist: "Unknown Artist", name: base };
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const currentTrack = tracks[currentIndex] ?? null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only re-run when track index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.url;
    audio.volume = volume;
    if (isPlaying) audio.play().catch(() => {});
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const handleNext = useCallback(() => {
    if (tracks.length === 0) return;
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * tracks.length));
    } else {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    }
  }, [tracks.length, shuffle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
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

  const handlePrev = useCallback(() => {
    if (tracks.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [isPlaying, currentTrack]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      audio.currentTime = ratio * duration;
    },
    [duration],
  );

  const handleAddFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const newTracks = files.map((f) => ({
        ...parseTrackInfo(f),
        url: URL.createObjectURL(f),
        file: f,
      }));
      setTracks((prev) => [...prev, ...newTracks]);
      if (e.target) e.target.value = "";
    },
    [],
  );

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="flex h-full bg-transparent text-foreground font-sans"
      data-ocid="musicplayer.panel"
    >
      {/* biome-ignore lint/a11y/useMediaCaption: music player, captions not applicable */}
      <audio ref={audioRef} />

      {/* Main area */}
      <div className="flex flex-col flex-1 p-5 gap-4 overflow-hidden">
        {tracks.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-3"
            data-ocid="musicplayer.empty_state"
          >
            <Music
              className="w-14 h-14 opacity-20"
              style={{ color: "var(--os-accent)" }}
            />
            <p className="text-sm text-muted-foreground">
              Drop audio files to begin
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="musicplayer.upload_button"
              className="mt-2 px-4 py-2 text-xs rounded border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              + Add Files
            </button>
          </div>
        ) : (
          <>
            {/* Visualizer + Now Playing */}
            <div className="flex flex-col items-center gap-3 pt-2">
              {/* Vinyl disc */}
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, #1a1a2e 60%, #27D7E0 100%)",
                  boxShadow: isPlaying
                    ? "0 0 24px rgba(39,215,224,0.6), 0 0 48px rgba(39,215,224,0.2)"
                    : "0 0 8px rgba(0,0,0,0.5)",
                  animation: isPlaying
                    ? "vinylSpin 3s linear infinite"
                    : "none",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background: "var(--os-bg-app)",
                    border: "2px solid var(--os-accent)",
                  }}
                />
              </div>

              {/* Waveform bars */}
              {isPlaying && (
                <div className="flex items-end gap-1 h-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-sm"
                      style={{
                        background: "var(--os-accent)",
                        animation: `barPulse${i} ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                        height: "100%",
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="text-center">
                <p className="text-sm font-semibold truncate max-w-[220px]">
                  {currentTrack?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentTrack?.artist}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex flex-col gap-1">
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: progress scrubber, keyboard not needed */}
              <div
                className="h-1.5 rounded-full cursor-pointer"
                style={{ background: "rgba(39,215,224,0.15)" }}
                onClick={handleProgressClick}
                data-ocid="musicplayer.canvas_target"
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: duration ? `${(progress / duration) * 100}%` : "0%",
                    background: "var(--os-accent)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>{fmt(progress)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShuffle((s) => !s)}
                data-ocid="musicplayer.toggle"
                className="p-1.5 rounded hover:bg-white/8 transition-colors"
                style={{ color: shuffle ? "#27D7E0" : undefined }}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handlePrev}
                data-ocid="musicplayer.secondary_button"
                className="p-1.5 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handlePlayPause}
                data-ocid="musicplayer.primary_button"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{
                  background: "var(--os-accent)",
                  color: "#0B0F12",
                  boxShadow: isPlaying
                    ? "0 0 16px rgba(39,215,224,0.5)"
                    : "none",
                }}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={handleNext}
                data-ocid="musicplayer.button"
                className="p-1.5 rounded hover:bg-white/8 transition-colors text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setRepeat((r) => !r)}
                data-ocid="musicplayer.secondary_button"
                className="p-1.5 rounded hover:bg-white/8 transition-colors"
                style={{ color: repeat ? "#27D7E0" : undefined }}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                data-ocid="musicplayer.input"
                className="flex-1 h-1 accent-cyan-400 cursor-pointer"
              />
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={handleAddFiles}
        />

        {tracks.length > 0 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            data-ocid="musicplayer.upload_button"
            className="w-full py-1.5 text-xs rounded border border-cyan-500/30 text-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors mt-auto"
          >
            + Add More Files
          </button>
        )}
      </div>

      {/* Playlist panel */}
      {tracks.length > 0 && (
        <div
          className="w-48 flex flex-col border-l"
          style={{ borderColor: "rgba(39,215,224,0.15)" }}
          data-ocid="musicplayer.list"
        >
          <div
            className="px-3 py-2 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground border-b"
            style={{ borderColor: "rgba(39,215,224,0.1)" }}
          >
            Playlist
          </div>
          <div className="flex-1 overflow-y-auto">
            {tracks.map((track, i) => (
              <button
                key={track.url}
                type="button"
                onClick={() => {
                  setCurrentIndex(i);
                  setTimeout(
                    () => audioRef.current?.play().catch(() => {}),
                    50,
                  );
                }}
                data-ocid={`musicplayer.item.${i + 1}`}
                className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5"
                style={{
                  borderLeft:
                    i === currentIndex
                      ? "2px solid #27D7E0"
                      : "2px solid transparent",
                  color: i === currentIndex ? "#27D7E0" : undefined,
                }}
              >
                <p className="truncate font-medium">{track.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {track.artist}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes barPulse1 { from { height: 20%; } to { height: 80%; } }
        @keyframes barPulse2 { from { height: 40%; } to { height: 100%; } }
        @keyframes barPulse3 { from { height: 60%; } to { height: 30%; } }
        @keyframes barPulse4 { from { height: 20%; } to { height: 90%; } }
        @keyframes barPulse5 { from { height: 70%; } to { height: 40%; } }
      `}</style>
    </div>
  );
}

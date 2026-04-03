import {
  Calendar,
  Database,
  FileText,
  Globe,
  Lock,
  Monitor,
  Server,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DecentOSLogo } from "./DecentOSLogo";

interface LandingPageProps {
  onLaunch: () => void;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        size: seededRandom(i * 3) * 2 + 0.5,
        left: seededRandom(i * 3 + 1) * 100,
        top: seededRandom(i * 3 + 2) * 100,
        opacity: seededRandom(i * 7) * 0.6 + 0.1,
        duration: seededRandom(i * 5) * 4 + 3,
        delay: seededRandom(i * 11) * 5,
      })),
    [],
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute rounded-full bg-white"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            left: `${s.left}%`,
            top: `${s.top}%`,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

function OsMockup() {
  return (
    <div
      className="relative w-full max-w-[480px] mx-auto"
      style={{
        filter:
          "drop-shadow(0 0 40px rgba(99,102,241,0.4)) drop-shadow(0 24px 60px rgba(0,0,0,0.8))",
        animation: "mockupBreathe 6s ease-in-out infinite",
        willChange: "transform",
      }}
    >
      {/* Browser chrome */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.1)",
          background: "#0d0d16",
        }}
      >
        {/* Browser top bar */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{
            background: "#1a1a2e",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#ff5f57" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#febc2e" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#28c840" }}
            />
          </div>
          <div
            className="flex-1 mx-2 rounded px-2 py-0.5 text-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            decent-os.icp
          </div>
        </div>

        {/* OS desktop */}
        <div
          className="relative"
          style={{
            height: 280,
            background:
              "linear-gradient(145deg, #0a0a1a 0%, #0f0f22 60%, #0a0a18 100%)",
          }}
        >
          {/* Menu bar */}
          <div
            className="flex items-center justify-between px-3"
            style={{
              height: 22,
              background: "rgba(10,10,25,0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <div className="flex items-center gap-2">
              <DecentOSLogo size={10} />
              <span
                className="font-semibold tracking-widest"
                style={{ fontSize: "0.55rem" }}
              >
                DECENTOS
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>File</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Edit</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>View</span>
            </div>
            <div
              className="flex gap-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <span>12:34</span>
              <span>☀️</span>
            </div>
          </div>

          {/* Desktop icons */}
          <div className="absolute left-2 top-6 flex flex-col gap-2">
            {[
              { icon: FileText, color: "#f97316", label: "Notes" },
              { icon: Monitor, color: "#6366f1", label: "Files" },
              { icon: Calendar, color: "#22c55e", label: "Cal" },
              { icon: Terminal, color: "#3b82f6", label: "Term" },
            ].map(({ icon: Icon, color, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: color, opacity: 0.9 }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span
                  style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.8)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Open Notes window */}
          <div
            className="absolute rounded-xl overflow-hidden"
            style={{
              top: 32,
              left: 56,
              right: 6,
              bottom: 32,
              background: "rgba(18,18,32,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {/* Window title bar */}
            <div
              className="flex items-center gap-1.5 px-2"
              style={{
                height: 22,
                background: "rgba(25,25,45,0.95)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "rgba(255,95,87,0.7)" }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "rgba(254,188,46,0.7)" }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "rgba(40,200,64,0.7)" }}
                />
              </div>
              <span
                className="flex-1 text-center"
                style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.6)" }}
              >
                Notes
              </span>
            </div>
            {/* Window content */}
            <div className="p-3 flex flex-col gap-2">
              <div
                className="font-medium"
                style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.9)" }}
              >
                📝 Q4 Planning
              </div>
              {[
                { w: "85%", op: 0.5 },
                { w: "70%", op: 0.35 },
                { w: "90%", op: 0.5 },
                { w: "55%", op: 0.35 },
                { w: "75%", op: 0.5 },
                { w: "40%", op: 0.25 },
              ].map(({ w, op }) => (
                <div
                  key={`note-${w}-${op}`}
                  className="rounded"
                  style={{
                    height: 4,
                    width: w,
                    background: `rgba(99,102,241,${op})`,
                  }}
                />
              ))}
              <div
                className="mt-1 font-medium"
                style={{ fontSize: "0.55rem", color: "rgba(99,102,241,0.8)" }}
              >
                Stored on-chain · Auto-saved
              </div>
            </div>
          </div>

          {/* Dock */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              { icon: FileText, color: "#f97316" },
              { icon: Monitor, color: "#6366f1" },
              { icon: Calendar, color: "#22c55e" },
              { icon: Server, color: "#a855f7" },
              { icon: Globe, color: "#3b82f6" },
            ].map(({ icon: Icon, color }) => (
              <div
                key={color}
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: color }}
              >
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const [heroVisible, setHeroVisible] = useState(false);
  const featuresInView = useInView();
  const ctaInView = useInView();

  useEffect(() => {
    const t = requestAnimationFrame(() => setHeroVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--star-op, 0.3); transform: scale(1); }
          50% { opacity: 0.05; transform: scale(0.5); }
        }
        @keyframes mockupBreathe {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.012) translateY(-4px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 1; }
        }
        .landing-scroll-container {
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }
        .landing-section {
          height: 100vh;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          overflow: hidden;
          position: relative;
        }
      `}</style>

      <div className="landing-scroll-container">
        {/* ── SECTION 1: HERO ── */}
        <section
          className="landing-section flex flex-col"
          style={{ background: "#060814" }}
          data-ocid="landing.hero.section"
        >
          {/* Indigo glow orbs */}
          <div
            className="absolute pointer-events-none"
            aria-hidden
            style={{
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
              top: "-15%",
              right: "-10%",
            }}
          />
          <div
            className="absolute pointer-events-none"
            aria-hidden
            style={{
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
              bottom: "10%",
              left: "5%",
            }}
          />

          {/* Top nav */}
          <nav className="relative z-10 flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-2.5">
              <DecentOSLogo size={28} />
              <span
                className="font-bold tracking-[0.15em] text-white text-sm"
                style={{ fontFamily: "'SF Pro Display', 'Inter', sans-serif" }}
              >
                DECENTOS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  color: "rgba(139,92,246,0.9)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                }}
              >
                ICP BLOCKCHAIN
              </span>
              <button
                onClick={onLaunch}
                className="text-xs font-medium"
                style={{ color: "rgba(255,255,255,0.55)" }}
                type="button"
                data-ocid="landing.hero.launch_button"
              >
                Launch App →
              </button>
            </div>
          </nav>

          {/* Hero content */}
          <div className="relative z-10 flex-1 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={heroVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    fontSize: "0.72rem",
                    color: "rgba(139,92,246,0.9)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Fully Decentralized · No Servers
                </div>

                <h1
                  className="font-bold text-white leading-[1.05] mb-5"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                    fontFamily:
                      "'SF Pro Display', 'Inter', system-ui, sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Your OS.
                  <br />
                  <span style={{ color: "#818cf8" }}>On the blockchain.</span>
                </h1>

                <p
                  className="mb-8 leading-relaxed"
                  style={{
                    fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                    color: "rgba(255,255,255,0.52)",
                    maxWidth: 480,
                  }}
                >
                  A complete desktop OS — files, notes, calendar, terminal —
                  running entirely on-chain. No servers. Nobody owns it but you.
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={onLaunch}
                    className="font-semibold rounded-xl px-7 py-3.5 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      color: "white",
                      fontSize: "0.95rem",
                      boxShadow:
                        "0 0 24px rgba(99,102,241,0.5), 0 4px 16px rgba(0,0,0,0.4)",
                    }}
                    type="button"
                    data-ocid="landing.hero.primary_button"
                  >
                    Launch DecentOS
                  </button>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  >
                    Free · No signup needed
                  </span>
                </div>
              </motion.div>

              {/* Right: OS mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={heroVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="hidden lg:flex justify-center"
              >
                <OsMockup />
              </motion.div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroVisible ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            className="relative z-10 flex justify-center pb-6"
          >
            <div
              className="flex flex-col items-center gap-1"
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
              }}
            >
              <span>SCROLL</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                role="presentation"
              >
                <path
                  d="M6 2v8M3 7l3 3 3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </section>

        {/* ── SECTION 2: FEATURES ── */}
        <section
          className="landing-section flex flex-col items-center justify-center px-6 md:px-10"
          style={{ background: "#0f1117" }}
          data-ocid="landing.features.section"
        >
          <DotGrid />

          <div
            ref={featuresInView.ref}
            className="relative z-10 w-full max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={featuresInView.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-14"
            >
              <p
                className="mb-3 tracking-widest uppercase"
                style={{ fontSize: "0.7rem", color: "rgba(99,102,241,0.7)" }}
              >
                Why DecentOS
              </p>
              <h2
                className="font-bold text-white"
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Built different. Owned by nobody.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Database,
                  color: "#3b82f6",
                  colorBg: "rgba(59,130,246,0.12)",
                  colorBorder: "rgba(59,130,246,0.2)",
                  title: "Sovereign Data",
                  desc: "Your files live across thousands of blockchain nodes. No company can delete, censor, or lose them.",
                  delay: 0.1,
                },
                {
                  icon: Monitor,
                  color: "#a855f7",
                  colorBg: "rgba(168,85,247,0.12)",
                  colorBorder: "rgba(168,85,247,0.2)",
                  title: "90+ Built-in Apps",
                  desc: "Notes, Spreadsheet, Calendar, Password Manager, Terminal and more. All persistent, all on-chain.",
                  delay: 0.2,
                },
                {
                  icon: Globe,
                  color: "#22c55e",
                  colorBg: "rgba(34,197,94,0.12)",
                  colorBorder: "rgba(34,197,94,0.2)",
                  title: "Works in Any Browser",
                  desc: "No install. No account. Open the URL and get a complete desktop OS backed by cryptographic guarantees.",
                  delay: 0.3,
                },
              ].map(
                ({
                  icon: Icon,
                  color,
                  colorBg,
                  colorBorder,
                  title,
                  desc,
                  delay,
                }) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 28 }}
                    animate={featuresInView.inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-2xl p-7"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    data-ocid="landing.features.card"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        background: colorBg,
                        border: `1px solid ${colorBorder}`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <h3
                      className="font-semibold text-white mb-2"
                      style={{ fontSize: "1.05rem" }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.6,
                      }}
                    >
                      {desc}
                    </p>
                  </motion.div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: CTA ── */}
        <section
          className="landing-section flex flex-col items-center justify-between px-6 md:px-10"
          style={{
            background:
              "linear-gradient(135deg, #0a0520 0%, #170430 50%, #0d0a2e 100%)",
          }}
          data-ocid="landing.cta.section"
        >
          <StarField />

          {/* Violet glow */}
          <div
            className="absolute pointer-events-none"
            aria-hidden
            style={{
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          <div
            ref={ctaInView.ref}
            className="relative z-10 flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={ctaInView.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="mb-8">
                <DecentOSLogo size={56} />
              </div>

              <h2
                className="font-bold text-white mb-5"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                The OS no one
                <br />
                <span style={{ color: "#a78bfa" }}>can shut down.</span>
              </h2>

              <p
                className="mb-10"
                style={{
                  fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                  color: "rgba(255,255,255,0.45)",
                  maxWidth: 440,
                  lineHeight: 1.7,
                }}
              >
                DecentOS runs entirely on the Internet Computer.
                <br />
                Launch it, use it, own it.
              </p>

              <button
                onClick={onLaunch}
                className="font-semibold rounded-xl px-8 py-4 mb-10 transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
                  color: "white",
                  fontSize: "1rem",
                  boxShadow:
                    "0 0 32px rgba(124,58,237,0.45), 0 4px 20px rgba(0,0,0,0.5)",
                }}
                type="button"
                data-ocid="landing.cta.launch_button"
              >
                Launch DecentOS — It's Free
              </button>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                {[
                  { icon: Lock, label: "ICP Blockchain" },
                  { icon: Database, label: "400GB On-chain Storage" },
                  { icon: Server, label: "No Login Required" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: "#818cf8" }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="relative z-10 pb-6 text-center">
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>
              © {new Date().getFullYear()} DecentOS · Built on Internet Computer
              · Open Source
              {" · "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.2)",
                  textDecoration: "none",
                }}
              >
                Built with caffeine.ai
              </a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

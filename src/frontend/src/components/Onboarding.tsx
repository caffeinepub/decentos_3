import { Cpu, FolderOpen, Monitor } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const ONBOARDING_KEY = "decent_os_onboarded";

export function hasBeenOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return false;
  }
}

const STEPS = [
  {
    icon: Monitor,
    title: "Welcome to DecentOS",
    body: "Your personal operating system, running entirely on the Internet Computer blockchain. No servers. No central authority. Just you and your data.",
  },
  {
    icon: FolderOpen,
    title: "Open apps from the desktop",
    body: "Click any icon on the left to open an app. Use Spotlight (Ctrl+Space) to quickly find and launch any of the 90+ apps in the system.",
  },
  {
    icon: Cpu,
    title: "Your data lives on-chain",
    body: "Everything saves automatically to the blockchain. No accounts required, no servers to go down. Your notes, files, and settings are yours permanently.",
  },
];

interface OnboardingProps {
  onDone: () => void;
}

export function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      try {
        localStorage.setItem(ONBOARDING_KEY, "true");
      } catch {}
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  };

  const { icon: Icon, title, body } = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
      data-ocid="onboarding.modal"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl p-8 flex flex-col items-center text-center"
          style={{
            width: 380,
            background: "rgba(10, 16, 22, 0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(99,102,241,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
            }}
          >
            <Icon
              className="w-7 h-7"
              style={{ color: "rgba(99,102,241,0.9)" }}
            />
          </div>

          {/* Text */}
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            {title}
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(255,255,255,0.52)", maxWidth: 300 }}
          >
            {body}
          </p>

          {/* Step dots */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((stepItem, i) => (
              <button
                key={stepItem.title}
                type="button"
                onClick={() => setStep(i)}
                data-ocid={`onboarding.tab.${i + 1}`}
                className="rounded-full transition-all"
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  background:
                    i === step
                      ? "rgba(99,102,241,0.9)"
                      : "rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleNext}
            data-ocid="onboarding.primary_button"
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "rgba(99,102,241,0.92)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(99,102,241,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(99,102,241,0.15)";
            }}
          >
            {isLast ? "Get Started" : "Next"}
          </button>

          {/* Skip */}
          {!isLast && (
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(ONBOARDING_KEY, "true");
                } catch {}
                onDone();
              }}
              data-ocid="onboarding.cancel_button"
              className="mt-3 text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.25)";
              }}
            >
              Skip intro
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

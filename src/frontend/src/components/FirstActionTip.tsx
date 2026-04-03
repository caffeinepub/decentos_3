import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const TIP_KEY = "decent_os_first_tip_shown";

interface FirstActionTipProps {
  appName: string;
  onDismiss: () => void;
}

export function FirstActionTip({ appName, onDismiss }: FirstActionTipProps) {
  const [countdown, setCountdown] = useState(8);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          handleDismiss();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(TIP_KEY, "true");
    } catch {}
    setTimeout(onDismiss, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          data-ocid="first-tip.modal"
          style={{
            position: "absolute",
            left: 80,
            top: 110,
            zIndex: 200,
            background: "rgba(20,20,28,0.95)",
            border: "1px solid rgba(99,102,241,0.5)",
            borderRadius: 16,
            padding: "14px 18px",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
            maxWidth: 240,
            cursor: "default",
          }}
        >
          {/* Arrow pointing left toward icons */}
          <div
            style={{
              position: "absolute",
              left: -7,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "7px solid transparent",
              borderBottom: "7px solid transparent",
              borderRight: "7px solid rgba(99,102,241,0.5)",
            }}
          />
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.45)",
              marginBottom: 4,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Quick tip
          </div>
          <div
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Click to open {appName}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            Find it in the icon grid on the left side of the desktop.
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                height: 3,
                flex: 1,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                overflow: "hidden",
                marginRight: 10,
              }}
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 8, ease: "linear" }}
                style={{
                  height: "100%",
                  background: "#6366f1",
                  borderRadius: 2,
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              data-ocid="first-tip.close_button"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                fontSize: 12,
                padding: 0,
                whiteSpace: "nowrap",
              }}
            >
              Dismiss ({countdown}s)
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function hasFirstTipBeenShown(): boolean {
  try {
    return localStorage.getItem(TIP_KEY) === "true";
  } catch {
    return false;
  }
}

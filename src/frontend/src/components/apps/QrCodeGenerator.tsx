import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, QrCode } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  windowProps?: Record<string, unknown>;
}

function buildQrUrl(text: string, size = 240): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=27D7E0&bgcolor=0b0f12&margin=10&format=png`;
}

export function QrCodeGenerator(_: Props) {
  const [text, setText] = useState("https://decentos.icp");
  const [qrUrl, setQrUrl] = useState(() => buildQrUrl("https://decentos.icp"));
  const [generated, setGenerated] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) {
      toast.error("Enter some text or URL");
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
      toast.success("QR code downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div
      className="flex h-full flex-col items-center gap-6 p-6"
      style={{ background: "rgba(11,15,18,0.7)" }}
    >
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Label className="text-xs text-muted-foreground/60">Text or URL</Label>
        <div className="flex gap-2">
          <Input
            data-ocid="qrcode.input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="https://example.com"
            className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/60"
          />
          <Button
            data-ocid="qrcode.primary_button"
            onClick={handleGenerate}
            style={{ background: "var(--os-accent)", color: "#000" }}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* QR Image */}
      <div
        className="flex items-center justify-center rounded-2xl border border-border p-6"
        style={{
          background: "rgba(11,15,28,0.8)",
          minWidth: 276,
          minHeight: 276,
        }}
      >
        {loading && (
          <div
            className="text-xs text-muted-foreground/60"
            data-ocid="qrcode.loading_state"
          >
            Generating…
          </div>
        )}
        <img
          src={qrUrl}
          alt="QR code"
          width={240}
          height={240}
          style={{
            display: loading ? "none" : "block",
            imageRendering: "pixelated",
          }}
          onLoad={() => {
            setLoading(false);
            setGenerated(true);
          }}
          onError={() => {
            setLoading(false);
            toast.error("QR generation failed — check your connection");
          }}
        />
      </div>

      {generated && (
        <Button
          data-ocid="qrcode.secondary_button"
          variant="outline"
          className="border-border text-foreground hover:bg-muted/50"
          onClick={downloadPng}
        >
          <Download className="mr-2 h-4 w-4" /> Download PNG
        </Button>
      )}
    </div>
  );
}

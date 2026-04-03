import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function xorCipher(text: string, password: string): string {
  if (!password) return text;
  const key = password.split("").map((c) => c.charCodeAt(0));
  return text
    .split("")
    .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key[i % key.length]))
    .join("");
}

function toBase64(str: string): string {
  try {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
  } catch {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

function fromBase64(str: string): string {
  try {
    const bytes = atob(str);
    return new TextDecoder().decode(
      new Uint8Array(bytes.split("").map((c) => c.charCodeAt(0))),
    );
  } catch {
    return decodeURIComponent(escape(atob(str)));
  }
}

interface Props {
  windowProps?: Record<string, unknown>;
}

export function EncryptionTool(_: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");

  const handleProcess = () => {
    if (!password) {
      toast.error("Enter a password");
      return;
    }
    if (!input.trim()) {
      toast.error("Enter some text");
      return;
    }
    try {
      if (mode === "encrypt") {
        const ciphered = xorCipher(input, password);
        setOutput(toBase64(ciphered));
        toast.success("Text encrypted");
      } else {
        const decoded = fromBase64(input.trim());
        const plain = xorCipher(decoded, password);
        setOutput(plain);
        toast.success("Text decrypted");
      }
    } catch {
      toast.error("Failed — check your input and password");
    }
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const glassPanel = "rounded-xl border border-border bg-muted/50 p-4";

  return (
    <div
      className="flex h-full flex-col gap-4 p-4"
      style={{ background: "rgba(11,15,18,0.7)" }}
    >
      {/* Mode + Password row */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex gap-2">
          <Button
            data-ocid="encryption.encrypt_button"
            size="sm"
            variant={mode === "encrypt" ? "default" : "outline"}
            onClick={() => setMode("encrypt")}
            style={
              mode === "encrypt"
                ? { background: "var(--os-accent)", color: "#000" }
                : {}
            }
          >
            <Lock className="mr-1 h-3.5 w-3.5" /> Encrypt
          </Button>
          <Button
            data-ocid="encryption.decrypt_button"
            size="sm"
            variant={mode === "decrypt" ? "default" : "outline"}
            onClick={() => setMode("decrypt")}
            style={
              mode === "decrypt"
                ? { background: "var(--os-accent)", color: "#000" }
                : {}
            }
          >
            <Unlock className="mr-1 h-3.5 w-3.5" /> Decrypt
          </Button>
        </div>
        <div className="flex flex-1 flex-col gap-1 min-w-[200px]">
          <Label className="text-xs text-muted-foreground/60">Password</Label>
          <Input
            data-ocid="encryption.input"
            type="password"
            placeholder="Enter encryption password…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-border bg-muted/50 text-foreground placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Panels */}
      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2">
        <div className={`flex flex-col gap-2 ${glassPanel}`}>
          <Label className="text-xs text-muted-foreground/60">
            {mode === "encrypt" ? "Plaintext" : "Ciphertext (Base64)"}
          </Label>
          <Textarea
            data-ocid="encryption.textarea"
            placeholder={
              mode === "encrypt"
                ? "Enter text to encrypt…"
                : "Paste Base64 cipher…"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 resize-none border-border bg-transparent text-foreground placeholder:text-muted-foreground/60 font-mono text-sm"
            style={{ minHeight: "180px" }}
          />
        </div>
        <div className={`flex flex-col gap-2 ${glassPanel}`}>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground/60">
              {mode === "encrypt" ? "Ciphertext (Base64)" : "Plaintext"}
            </Label>
            <Button
              data-ocid="encryption.secondary_button"
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-muted-foreground/60 hover:text-foreground"
              onClick={copyOutput}
            >
              <Copy className="mr-1 h-3 w-3" /> Copy
            </Button>
          </div>
          <Textarea
            readOnly
            value={output}
            placeholder="Output appears here…"
            className="flex-1 resize-none border-border bg-transparent text-muted-foreground placeholder:text-muted-foreground/30 font-mono text-sm"
            style={{ minHeight: "180px" }}
          />
        </div>
      </div>

      {/* Action */}
      <Button
        data-ocid="encryption.submit_button"
        onClick={handleProcess}
        className="w-full font-semibold"
        style={{ background: "var(--os-accent)", color: "#000" }}
      >
        {mode === "encrypt" ? "Encrypt" : "Decrypt"}
      </Button>
    </div>
  );
}

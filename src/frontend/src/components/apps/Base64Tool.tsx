import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

interface Base64ToolProps {
  windowProps?: Record<string, unknown>;
}

export function Base64Tool({ windowProps: _windowProps }: Base64ToolProps) {
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");
  const [decodeError, setDecodeError] = useState("");

  const handleEncode = () => {
    try {
      setEncodeOutput(btoa(unescape(encodeURIComponent(encodeInput))));
    } catch {
      setEncodeOutput("");
      toast.error("Encode failed");
    }
  };

  const handleDecode = () => {
    try {
      setDecodeOutput(decodeURIComponent(escape(atob(decodeInput.trim()))));
      setDecodeError("");
    } catch {
      setDecodeOutput("");
      setDecodeError("Invalid Base64 — unable to decode");
    }
  };

  const handleCopyEncode = () => {
    if (!encodeOutput) return;
    navigator.clipboard.writeText(encodeOutput);
    toast.success("Copied");
  };

  const handleCopyDecode = () => {
    if (!decodeOutput) return;
    navigator.clipboard.writeText(decodeOutput);
    toast.success("Copied");
  };

  const panelStyle = {
    background: "rgba(11,15,18,0.6)",
    border: "1px solid rgba(42,58,66,0.8)",
  };

  const fieldLabel = (text: string) => (
    <div className="text-xs" style={{ color: "#888" }}>
      {text}
    </div>
  );

  return (
    <div
      data-ocid="base64tool.panel"
      className="flex flex-col h-full p-3 gap-3 text-foreground"
      style={{ background: "rgba(11,15,18,0.6)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-sm font-semibold"
          style={{ color: "rgba(39,215,224,1)" }}
        >
          Base64 Tool
        </span>
      </div>

      <Tabs defaultValue="encode" className="flex flex-col flex-1">
        <TabsList
          className="w-fit"
          style={{ background: "rgba(42,58,66,0.4)" }}
        >
          <TabsTrigger
            data-ocid="base64tool.encode_tab"
            value="encode"
            className="text-xs"
          >
            Encode
          </TabsTrigger>
          <TabsTrigger
            data-ocid="base64tool.decode_tab"
            value="decode"
            className="text-xs"
          >
            Decode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="flex flex-col flex-1 gap-2 mt-2">
          <div className="flex flex-col flex-1 gap-2">
            {fieldLabel("Text Input")}
            <textarea
              data-ocid="base64tool.input"
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Enter text to encode..."
              className="flex-1 resize-none rounded p-2 text-xs outline-none text-foreground"
              style={{ ...panelStyle, fontFamily: "monospace", minHeight: 80 }}
            />
            <Button
              data-ocid="base64tool.submit_button"
              size="sm"
              onClick={handleEncode}
              className="self-start h-7 px-3 text-xs"
              style={{
                background: "rgba(39,215,224,0.15)",
                color: "rgba(39,215,224,1)",
                border: "1px solid rgba(39,215,224,0.4)",
              }}
            >
              Encode →
            </Button>
            {fieldLabel("Base64 Output")}
            <textarea
              data-ocid="base64tool.textarea"
              value={encodeOutput}
              readOnly
              placeholder="Base64 encoded result..."
              className="flex-1 resize-none rounded p-2 text-xs outline-none"
              style={{
                ...panelStyle,
                fontFamily: "monospace",
                color: "rgba(39,215,224,0.9)",
                minHeight: 80,
              }}
            />
            <Button
              data-ocid="base64tool.copy_button"
              size="sm"
              variant="outline"
              onClick={handleCopyEncode}
              disabled={!encodeOutput}
              className="self-start h-7 px-3 text-xs"
              style={{ borderColor: "rgba(42,58,66,0.8)", color: "#aaa" }}
            >
              Copy Output
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="decode" className="flex flex-col flex-1 gap-2 mt-2">
          <div className="flex flex-col flex-1 gap-2">
            {fieldLabel("Base64 Input")}
            <textarea
              data-ocid="base64tool.input"
              value={decodeInput}
              onChange={(e) => {
                setDecodeInput(e.target.value);
                setDecodeError("");
              }}
              placeholder="Paste Base64 string here..."
              className="flex-1 resize-none rounded p-2 text-xs outline-none text-foreground"
              style={{
                ...panelStyle,
                fontFamily: "monospace",
                minHeight: 80,
                borderColor: decodeError ? "rgba(239,68,68,0.5)" : undefined,
              }}
            />
            {decodeError && (
              <div
                data-ocid="base64tool.error_state"
                className="text-xs"
                style={{ color: "#f87171" }}
              >
                ⚠ {decodeError}
              </div>
            )}
            <Button
              data-ocid="base64tool.submit_button"
              size="sm"
              onClick={handleDecode}
              className="self-start h-7 px-3 text-xs"
              style={{
                background: "rgba(39,215,224,0.15)",
                color: "rgba(39,215,224,1)",
                border: "1px solid rgba(39,215,224,0.4)",
              }}
            >
              Decode →
            </Button>
            {fieldLabel("Decoded Output")}
            <textarea
              data-ocid="base64tool.textarea"
              value={decodeOutput}
              readOnly
              placeholder="Decoded text will appear here..."
              className="flex-1 resize-none rounded p-2 text-xs outline-none"
              style={{
                ...panelStyle,
                fontFamily: "monospace",
                color: "rgba(39,215,224,0.9)",
                minHeight: 80,
              }}
            />
            <Button
              data-ocid="base64tool.copy_button"
              size="sm"
              variant="outline"
              onClick={handleCopyDecode}
              disabled={!decodeOutput}
              className="self-start h-7 px-3 text-xs"
              style={{ borderColor: "rgba(42,58,66,0.8)", color: "#aaa" }}
            >
              Copy Output
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

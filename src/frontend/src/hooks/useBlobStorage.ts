import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

export interface BlobUploadResult {
  url: string;
  hash: string;
}

export function useBlobStorage() {
  const clientRef = useRef<StorageClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        if (config.backend_host?.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {});
        }
        const client = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        if (!cancelled) {
          clientRef.current = client;
          setIsReady(true);
        }
      } catch (e) {
        console.error("[useBlobStorage] Failed to init StorageClient", e);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const upload = useCallback(
    async (
      blob: Blob,
      onProgress?: (pct: number) => void,
    ): Promise<BlobUploadResult> => {
      if (!clientRef.current) {
        throw new Error("Storage client not ready");
      }
      setIsUploading(true);
      try {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const { hash } = await clientRef.current.putFile(bytes, onProgress);
        const url = await clientRef.current.getDirectURL(hash);
        return { url, hash };
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return { upload, isReady, isUploading };
}

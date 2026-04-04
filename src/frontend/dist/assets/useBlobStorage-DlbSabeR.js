import { c as createLucideIcon, r as reactExports, aq as loadConfig, ar as HttpAgent, as as StorageClient } from "./index-8tMpYjTW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
];
const Cloud = createLucideIcon("cloud", __iconNode);
function useBlobStorage() {
  const clientRef = reactExports.useRef(null);
  const [isReady, setIsReady] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let cancelled = false;
    async function init() {
      var _a;
      try {
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        if ((_a = config.backend_host) == null ? void 0 : _a.includes("localhost")) {
          await agent.fetchRootKey().catch(() => {
          });
        }
        const client = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent
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
  const upload = reactExports.useCallback(
    async (blob, onProgress) => {
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
    []
  );
  return { upload, isReady, isUploading };
}
export {
  Cloud as C,
  useBlobStorage as u
};

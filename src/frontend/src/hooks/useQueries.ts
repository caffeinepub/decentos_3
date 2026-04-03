import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AppInfo, FileNodeView } from "../backend.d";
import { useActor } from "./useActor";

export function useListChildren(folderId: number | null) {
  const { actor, isFetching } = useActor();
  return useQuery<FileNodeView[]>({
    queryKey: ["listChildren", folderId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChildren(folderId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReadFile(fileId: number | null) {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["readFile", fileId],
    queryFn: async () => {
      if (!actor || fileId === null) return "";
      return actor.readFile(fileId);
    },
    enabled: !!actor && !isFetching && fileId !== null,
  });
}

export function useListAvailableApps() {
  const { actor, isFetching } = useActor();
  return useQuery<AppInfo[]>({
    queryKey: ["listAvailableApps"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAvailableApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListInstalledApps() {
  const { actor, isFetching } = useActor();
  return useQuery<AppInfo[]>({
    queryKey: ["listInstalledApps"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserInstalledApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCyclesBalance() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["cyclesBalance"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCyclesBalance();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

export function useCreateFile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      content,
      parentId,
    }: { name: string; content: string; parentId: number | null }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFile(name, content, parentId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listChildren"] }),
  });
}

export function useCreateFolder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      parentId,
    }: { name: string; parentId: number | null }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createFolder(name, parentId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listChildren"] }),
  });
}

export function useDeleteNode() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fileId: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteNode(fileId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listChildren"] }),
  });
}

export function useUpdateFileContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, content }: { fileId: number; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateFileContent(fileId, content);
    },
    onSuccess: (_, { fileId }) => {
      qc.invalidateQueries({ queryKey: ["readFile", fileId] });
      qc.invalidateQueries({ queryKey: ["listChildren"] });
    },
  });
}

export function useInstallApp() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appId: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.installApp(appId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listInstalledApps"] }),
  });
}

export function useUninstallApp() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appId: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.uninstallApp(appId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listInstalledApps"] });
      qc.invalidateQueries({ queryKey: ["allGrantedPermissions"] });
    },
  });
}

export function useGrantPermissions() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      appId,
      permissions,
    }: { appId: number; permissions: string[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.grantPermissions({ appId, permissions });
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["allGrantedPermissions"] }),
  });
}

export function useRevokePermissions() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (appId: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.revokePermissions(appId);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["allGrantedPermissions"] }),
  });
}

export function useListAllGrantedPermissions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allGrantedPermissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllGrantedPermissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSystemTime() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["systemTime"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getSystemTime();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

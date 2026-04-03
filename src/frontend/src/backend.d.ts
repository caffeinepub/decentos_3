import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface FileMetadata {
    url: string;
    name: string;
    size: bigint;
    mimeType: string;
    uploadedAt: bigint;
}
export interface SystemStats {
    osVersion: string;
    simulatedCyclesBalance: bigint;
    totalInstalledApps: bigint;
    systemTime: bigint;
}
export interface FileNodeView {
    id: number;
    content: string;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
    parentId?: number;
    nodeType: FileType;
}
export interface http_header {
    value: string;
    name: string;
}
export interface PermissionUpdateRequest {
    permissions: Array<string>;
    appId: number;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface HttpHeader {
    value: string;
    name: string;
}
export interface PermissionGrantView {
    permissions: Array<string>;
    grantedAt: bigint;
    appId: number;
}
export interface FileMetadataInput {
    url: string;
    name: string;
    size: bigint;
    mimeType: string;
}
export interface AppInfo {
    id: number;
    name: string;
    description: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface HttpResponse {
    body: string;
    headers: Array<HttpHeader>;
    statusCode: number;
}
export interface ProcessSummary {
    startTime: bigint;
    appId: number;
    appName: string;
    memoryUsage: bigint;
    cyclesUsed?: bigint;
}
export interface UserProfile {
    id: Principal;
    username: string;
    displayName: string;
    createdAt: bigint;
    darkMode: boolean;
    cycles: bigint;
    updatedAt: bigint;
}
export enum FileType {
    file = "file",
    folder = "folder"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createApp(name: string, description: string): Promise<number>;
    createFile(name: string, content: string, parentId: number | null): Promise<number>;
    createFolder(name: string, parentId: number | null): Promise<number>;
    deleteFileByUrl(url: string): Promise<void>;
    deleteNode(fileId: number): Promise<void>;
    fetchUrl(url: string): Promise<HttpResponse>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCyclesBalance(): Promise<bigint>;
    getFileMetadata(): Promise<Array<FileMetadata>>;
    getGrantedPermissions(appId: number): Promise<Array<string>>;
    getOSVersion(): Promise<string>;
    getPrincipalAsText(): Promise<string>;
    getSystemStats(): Promise<SystemStats>;
    getSystemTime(): Promise<bigint>;
    getTotalStorageBytesUsed(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantPermissions(request: PermissionUpdateRequest): Promise<void>;
    installApp(appId: number): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    kvDelete(key: string): Promise<void>;
    kvGet(key: string): Promise<string | null>;
    kvKeys(): Promise<Array<string>>;
    kvSet(key: string, value: string): Promise<void>;
    listAllGrantedPermissions(): Promise<Array<PermissionGrantView>>;
    listAvailableApps(): Promise<Array<AppInfo>>;
    listChildren(folderId: number | null): Promise<Array<FileNodeView>>;
    listRunningProcesses(appIds: Uint32Array): Promise<Array<ProcessSummary>>;
    listUserInstalledApps(): Promise<Array<AppInfo>>;
    readFile(fileId: number): Promise<string>;
    revokePermissions(appId: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFileMetadata(input: FileMetadataInput): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    uninstallApp(appId: number): Promise<void>;
    updateFileContent(fileId: number, newContent: string): Promise<void>;
}

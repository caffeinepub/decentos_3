import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Set "mo:core/Set";
import Nat32 "mo:core/Nat32";

import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import OutCall "http-outcalls/outcall";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use separate migration module for persistent actor

actor {
  // Storage for files
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type FileMetadata = {
    name : Text;
    size : Nat;
    mimeType : Text;
    url : Text;
    uploadedAt : Int;
  };

  public type UserProfile = {
    id : Principal;
    username : Text;
    displayName : Text;
    cycles : Nat;
    darkMode : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type FileType = {
    #file;
    #folder;
  };

  public type FileNode = {
    id : Nat32;
    name : Text;
    nodeType : FileType;
    content : Text;
    parentId : ?Nat32;
    createdAt : Int;
    updatedAt : Int;
  };

  public type AppInfo = {
    id : Nat32;
    name : Text;
    description : Text;
  };

  public type PermissionGrant = {
    appId : Nat32;
    permissions : Set.Set<Text>;
    grantedAt : Int;
  };

  type PermissionGrantView = {
    appId : Nat32;
    permissions : [Text];
    grantedAt : Int;
  };

  public type FileNodeView = {
    id : Nat32;
    name : Text;
    nodeType : FileType;
    content : Text;
    parentId : ?Nat32;
    createdAt : Int;
    updatedAt : Int;
  };

  public type FileNodeDTO = {
    id : ?Nat32;
    name : Text;
    nodeType : FileType;
    content : Text;
    parentId : ?Nat32;
  };

  public type PermissionUpdateRequest = {
    appId : Nat32;
    permissions : [Text];
  };

  public type FileIdentifier = {
    fileId : Nat32;
    ownerId : Principal;
  };

  public type HttpHeader = {
    name : Text;
    value : Text;
  };

  public type HttpResponse = {
    statusCode : Nat16;
    body : Text;
    headers : [HttpHeader];
  };

  public type FileMetadataInput = {
    name : Text;
    size : Nat;
    mimeType : Text;
    url : Text;
  };

  public type ProcessSummary = {
    appId : Nat32;
    appName : Text;
    startTime : Int;
    memoryUsage : Nat;
    cyclesUsed : ?Nat;
  };

  public type SystemStats = {
    osVersion : Text;
    systemTime : Int;
    totalInstalledApps : Nat;
    simulatedCyclesBalance : Nat;
  };

  // State - fileMetadata is now per-user
  let fileMetadata = Map.empty<Principal, List.List<FileMetadata>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let fileNodes = Map.empty<Principal, Map.Map<Nat32, FileNode>>();
  let installedApps = Map.empty<Principal, List.List<Nat32>>();
  let availableApps = Map.empty<Nat32, AppInfo>();
  let userPermissions = Map.empty<Principal, Map.Map<Nat32, PermissionGrant>>();
  let kvStore = Map.empty<Principal, Map.Map<Text, Text>>();

  var nextFileId : Nat32 = 1;
  var nextAppId : Nat32 = 1;
  let osVersion = "2.0.0";

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // File System Operations
  public shared ({ caller }) func createFolder(name : Text, parentId : ?Nat32) : async Nat32 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create folders");
    };
    let files = getOrCreateUserFileMap(caller);
    if (doesFileNameExistInParent(files, name, parentId)) { Runtime.trap("Cannot have multiple files of same name in the same folder: " # name) };
    let folder : FileNode = {
      id = nextFileId;
      name;
      nodeType = #folder;
      content = "";
      parentId;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    files.add(nextFileId, folder);
    let folderId = nextFileId;
    nextFileId += 1;
    folderId;
  };

  public shared ({ caller }) func createFile(name : Text, content : Text, parentId : ?Nat32) : async Nat32 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create files");
    };
    let files = getOrCreateUserFileMap(caller);
    if (doesFileNameExistInParent(files, name, parentId)) { Runtime.trap("Cannot have multiple files of same name in the same folder: " # name) };
    let file : FileNode = {
      id = nextFileId;
      name;
      nodeType = #file;
      content;
      parentId;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    files.add(nextFileId, file);
    let fileId = nextFileId;
    nextFileId += 1;
    fileId;
  };

  public shared ({ caller }) func updateFileContent(fileId : Nat32, newContent : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update files");
    };
    let files = getOrCreateUserFileMap(caller);
    switch (files.get(fileId)) {
      case (null) { Runtime.trap("File not found") };
      case (?file) {
        if (file.nodeType == #folder) { Runtime.trap("Cannot update a folder") };
        let updatedFile : FileNode = {
          id = file.id;
          name = file.name;
          nodeType = file.nodeType;
          content = newContent;
          parentId = file.parentId;
          createdAt = file.createdAt;
          updatedAt = Time.now();
        };
        files.add(fileId, updatedFile);
      };
    };
  };

  public shared ({ caller }) func deleteNode(fileId : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete files");
    };
    let files = getOrCreateUserFileMap(caller);
    switch (files.get(fileId)) {
      case (null) { Runtime.trap("File not found") };
      case (?file) { files.remove(fileId) };
    };
  };

  public query ({ caller }) func readFile(fileId : Nat32) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can read files");
    };
    let files = getOrCreateUserFileMap(caller);
    switch (files.get(fileId)) {
      case (null) { Runtime.trap("File not found") };
      case (?node) {
        switch (node.nodeType) {
          case (#file) { node.content };
          case (#folder) { Runtime.trap("Cannot read folder content") };
        };
      };
    };
  };

  public query ({ caller }) func listChildren(folderId : ?Nat32) : async [FileNodeView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list files");
    };
    let userFiles = getOrCreateUserFileMap(caller);
    let children = userFiles.values().filter(func(node : FileNode) : Bool {
      switch (folderId) {
        case (null) {
          switch (node.parentId) {
            case (null) { true };
            case (?_) { false };
          };
        };
        case (?parentId) {
          switch (node.parentId) {
            case (null) { false };
            case (?nodeParentId) { nodeParentId == parentId };
          };
        };
      };
    });
    let sortedChildren = children.toList<FileNode>().sort(func(a : FileNode, b : FileNode) : Order.Order {
      Nat32.compare(a.id, b.id)
    });
    sortedChildren.map<FileNode, FileNodeView>(func(node) {
      {
        id = node.id;
        name = node.name;
        nodeType = node.nodeType;
        content = node.content;
        parentId = node.parentId;
        createdAt = node.createdAt;
        updatedAt = node.updatedAt;
      }
    }).toArray();
  };

  // App Registry Operations
  public shared ({ caller }) func createApp(name : Text, description : Text) : async Nat32 {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create apps");
    };
    let newApp : AppInfo = {
      id = nextAppId;
      name;
      description;
    };
    availableApps.add(nextAppId, newApp);
    let appId = nextAppId;
    nextAppId += 1;
    appId;
  };

  public query func listAvailableApps() : async [AppInfo] {
    availableApps.values().toList<AppInfo>().sort(func(a : AppInfo, b : AppInfo) : Order.Order {
      Nat32.compare(a.id, b.id)
    }).toArray();
  };

  public shared ({ caller }) func installApp(appId : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can install apps");
    };
    switch (availableApps.get(appId)) {
      case (null) { Runtime.trap("App not found") };
      case (?_) {
        let userApps = getOrCreateUserAppList(caller);
        let containsApp = userApps.any(func(installedAppId : Nat32) : Bool { installedAppId == appId });
        if (containsApp) { Runtime.trap("App already installed") } else { userApps.add(appId) };
      };
    };
  };

  public shared ({ caller }) func uninstallApp(appId : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can uninstall apps");
    };
    let userApps = getOrCreateUserAppList(caller);
    let filteredApps = userApps.filter(func(installedAppId : Nat32) : Bool { installedAppId != appId });
    installedApps.add(caller, filteredApps);
    let userGrants = getOrCreateUserPermissionsMap(caller);
    userGrants.remove(appId);
  };

  public query ({ caller }) func listUserInstalledApps() : async [AppInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view installed apps");
    };
    let userApps = getOrCreateUserAppList(caller);
    let installedAppInfos = userApps.map<Nat32, ?AppInfo>(func(appId : Nat32) : ?AppInfo {
      availableApps.get(appId)
    }).filter(func(appOpt : ?AppInfo) : Bool {
      switch (appOpt) {
        case (null) { false };
        case (?_) { true };
      };
    }).map<?AppInfo, AppInfo>(func(appOpt : ?AppInfo) : AppInfo {
      switch (appOpt) {
        case (null) { Runtime.trap("Unreachable") };
        case (?app) { app };
      };
    });
    installedAppInfos.toArray();
  };

  // Permission Grants
  public shared ({ caller }) func grantPermissions(request : PermissionUpdateRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can grant permissions");
    };
    let appPermissions = Set.fromArray(request.permissions);
    let grant : PermissionGrant = {
      appId = request.appId;
      permissions = appPermissions;
      grantedAt = Time.now();
    };
    let userGrants = getOrCreateUserPermissionsMap(caller);
    userGrants.add(request.appId, grant);
    userPermissions.add(caller, userGrants);
  };

  public shared ({ caller }) func revokePermissions(appId : Nat32) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can revoke permissions");
    };
    let userGrants = getOrCreateUserPermissionsMap(caller);
    userGrants.remove(appId);
  };

  public query ({ caller }) func getGrantedPermissions(appId : Nat32) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view permissions");
    };
    switch (userPermissions.get(caller)) {
      case (null) { [] };
      case (?grantsMap) {
        switch (grantsMap.get(appId)) {
          case (null) { [] };
          case (?grant) { grant.permissions.toArray() };
        };
      };
    };
  };

  public query ({ caller }) func listAllGrantedPermissions() : async [PermissionGrantView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view permissions");
    };
    switch (userPermissions.get(caller)) {
      case (null) { [] };
      case (?grantsMap) {
        let grants = grantsMap.values();
        let views = List.empty<PermissionGrantView>();
        grants.forEach(func(grant) {
          views.add({
            appId = grant.appId;
            permissions = grant.permissions.toArray();
            grantedAt = grant.grantedAt;
          });
        });
        views.toArray();
      };
    };
  };

  // System Info Operations
  public query ({ caller }) func getCyclesBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cycles balance");
    };
    switch (userProfiles.get(caller)) {
      case (null) { 0 };
      case (?profile) { profile.cycles };
    };
  };

  public query ({ caller }) func getPrincipalAsText() : async Text {
    caller.toText();
  };

  public query func getOSVersion() : async Text {
    osVersion;
  };

  public query func getSystemTime() : async Int {
    Time.now();
  };

  public query ({ caller }) func getSystemStats() : async SystemStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view system stats");
    };
    var totalApps : Nat = 0;
    installedApps.values().forEach(func(userAppList : List.List<Nat32>) { totalApps += userAppList.size() });
    let currentTime = Time.now();
    let simulatedCycles = Int.abs(currentTime) % 1_000_000_000_000.toNat();
    {
      osVersion = osVersion;
      systemTime = currentTime;
      totalInstalledApps = totalApps;
      simulatedCyclesBalance = simulatedCycles;
    };
  };

  public query ({ caller }) func listRunningProcesses(appIds : [Nat32]) : async [ProcessSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view running processes");
    };
    let currentTime = Time.now();
    let processes = List.empty<ProcessSummary>();
    for (appId in appIds.vals()) {
      switch (availableApps.get(appId)) {
        case (null) {};
        case (?appInfo) {
          let appIdNat = appId.toNat();
          let startTime = currentTime - Int.abs(appIdNat * 1_000_000_000);
          let memoryUsage = (appIdNat * 1024 * 1024) % 100_000_000;
          let cyclesUsed = if (appId < 100) { null } else {
            ?(((appIdNat * Int.abs(currentTime).toNat()) % 1_000_000) + 10_000)
          };
          processes.add({
            appId = appId;
            appName = appInfo.name;
            startTime = startTime;
            memoryUsage = memoryUsage;
            cyclesUsed = cyclesUsed;
          });
        };
      };
    };
    processes.toArray();
  };

  // HTTP Outcalls
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared func fetchUrl(url : Text) : async HttpResponse {
    let responseText = await OutCall.httpGetRequest(url, [], transform);
    {
      statusCode = 200;
      body = responseText;
      headers = [];
    };
  };

  // Internal helpers
  func getOrCreateUserFileMap(user : Principal) : Map.Map<Nat32, FileNode> {
    switch (fileNodes.get(user)) {
      case (null) {
        let newFiles = Map.empty<Nat32, FileNode>();
        fileNodes.add(user, newFiles);
        newFiles;
      };
      case (?existingFiles) { existingFiles };
    };
  };

  func getOrCreateUserAppList(user : Principal) : List.List<Nat32> {
    switch (installedApps.get(user)) {
      case (null) {
        let newList = List.empty<Nat32>();
        installedApps.add(user, newList);
        newList;
      };
      case (?existingList) { existingList };
    };
  };

  func getOrCreateUserPermissionsMap(user : Principal) : Map.Map<Nat32, PermissionGrant> {
    switch (userPermissions.get(user)) {
      case (null) {
        let newGrants = Map.empty<Nat32, PermissionGrant>();
        userPermissions.add(user, newGrants);
        newGrants;
      };
      case (?existingGrants) { existingGrants };
    };
  };

  func doesFileNameExistInParent(files : Map.Map<Nat32, FileNode>, name : Text, parentId : ?Nat32) : Bool {
    files.values().any<FileNode>(func(file : FileNode) : Bool {
      file.name == name and equalOptNat32(file.parentId, parentId)
    });
  };

  func equalOptNat32(a : ?Nat32, b : ?Nat32) : Bool {
    switch (a, b) {
      case (null, null) { true };
      case (?aVal, ?bVal) { aVal == bVal };
      case (_, _) { false };
    };
  };

  // KV Store
  public shared ({ caller }) func kvSet(key : Text, value : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set KV data");
    };
    let userStore = getOrCreateUserKvStore(caller);
    userStore.add(key, value);
    kvStore.add(caller, userStore);
  };

  public query ({ caller }) func kvGet(key : Text) : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get KV data");
    };
    switch (kvStore.get(caller)) {
      case (null) { null };
      case (?userStore) { userStore.get(key) };
    };
  };

  public shared ({ caller }) func kvDelete(key : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete KV data");
    };
    switch (kvStore.get(caller)) {
      case (null) { () };
      case (?userStore) {
        userStore.remove(key);
        kvStore.add(caller, userStore);
      };
    };
  };

  public query ({ caller }) func kvKeys() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list KV keys");
    };
    switch (kvStore.get(caller)) {
      case (null) { [] };
      case (?userStore) {
        let keys = List.empty<Text>();
        userStore.keys().forEach(func(key) { keys.add(key) });
        keys.toArray();
      };
    };
  };

  func getOrCreateUserKvStore(user : Principal) : Map.Map<Text, Text> {
    switch (kvStore.get(user)) {
      case (null) {
        let newStore = Map.empty<Text, Text>();
        kvStore.add(user, newStore);
        newStore;
      };
      case (?existingStore) { existingStore };
    };
  };

  // Blob Storage - now per-user
  public query ({ caller }) func getFileMetadata() : async [FileMetadata] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view file metadata");
    };
    let userMetadata = getOrCreateUserFileMetadata(caller);
    userMetadata.toArray();
  };

  public shared ({ caller }) func deleteFileByUrl(url : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete files");
    };
    let userMetadata = getOrCreateUserFileMetadata(caller);
    let filteredList = userMetadata.filter(func(meta) { meta.url != url });
    fileMetadata.add(caller, filteredList);
  };

  public shared ({ caller }) func saveFileMetadata(input : FileMetadataInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save file metadata");
    };

    let metadata : FileMetadata = {
      input with uploadedAt = Time.now();
    };
    let userMetadata = getOrCreateUserFileMetadata(caller);
    userMetadata.add(metadata);
    fileMetadata.add(caller, userMetadata);
  };

  public query ({ caller }) func getTotalStorageBytesUsed() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view storage usage");
    };
    let userMetadata = getOrCreateUserFileMetadata(caller);
    userMetadata.foldLeft(
      0,
      func(acc, meta) { acc + meta.size },
    );
  };

  func getOrCreateUserFileMetadata(user : Principal) : List.List<FileMetadata> {
    switch (fileMetadata.get(user)) {
      case (null) {
        let newList = List.empty<FileMetadata>();
        fileMetadata.add(user, newList);
        newList;
      };
      case (?existingList) { existingList };
    };
  };
};

"use strict";
"use client";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var FilterTab_exports = {};
__export(FilterTab_exports, {
  FilterTab: () => FilterTab
});
module.exports = __toCommonJS(FilterTab_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_react = require("react");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var crypto = __toESM(require("crypto"));
var import_react_redux = require("react-redux");
var import_imageHash = require("./imageHash");
var import_conversations = require("../state/selectors/conversations");
const REGION = "us-east-1";
const TABLE_NAME = "SignalContentHashes";
const client = new import_client_dynamodb.DynamoDBClient({ region: REGION });
const docClient = import_lib_dynamodb.DynamoDBDocumentClient.from(client);
const FilterTab = /* @__PURE__ */ __name(({ i18n }) => {
  const [isEnabled, setIsEnabled] = (0, import_react.useState)(true);
  const [isGlobalEnabled, setIsGlobalEnabled] = (0, import_react.useState)(true);
  const [stats, setStats] = (0, import_react.useState)({
    imagesBlocked: 0,
    textsBlocked: 0,
    videosBlocked: 0
  });
  const conversations = (0, import_react_redux.useSelector)(import_conversations.getConversations);
  (0, import_react.useEffect)(() => {
    const loadSettings = /* @__PURE__ */ __name(async () => {
      try {
        const settings = await window.Signal.Data.getFilterSettings();
        if (settings) {
          setIsEnabled(settings.isEnabled);
          setIsGlobalEnabled(settings.isGlobalEnabled);
        }
      } catch (err) {
        console.error("Failed to load filter settings:", err);
      }
    }, "loadSettings");
    const loadStats = /* @__PURE__ */ __name(async () => {
      try {
        const saved = await window.Signal.Data.getFilterStats();
        if (saved) setStats(saved);
      } catch (err) {
        console.error("Failed to load filter stats:", err);
      }
    }, "loadStats");
    loadSettings();
    loadStats();
  }, []);
  (0, import_react.useEffect)(() => {
    const saveSettings = /* @__PURE__ */ __name(async () => {
      try {
        await window.Signal.Data.saveFilterSettings({
          isEnabled,
          isGlobalEnabled
        });
      } catch (err) {
        console.error("Failed to save filter settings:", err);
      }
    }, "saveSettings");
    saveSettings();
  }, [isEnabled, isGlobalEnabled]);
  const isLocalDuplicate = /* @__PURE__ */ __name(async (contentHash, _contentType) => {
    try {
      const result = await window.Signal.Data.getContentHashByHash(contentHash);
      return !!result;
    } catch (err) {
      console.error("Error checking local duplicate:", err);
      return false;
    }
  }, "isLocalDuplicate");
  const isGlobalDuplicate = /* @__PURE__ */ __name(async (contentHash, _contentType) => {
    if (!isGlobalEnabled) return false;
    try {
      const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "contentHash = :hash",
        ExpressionAttributeValues: { ":hash": contentHash }
      };
      const { Items } = await docClient.send(new import_lib_dynamodb.QueryCommand(params));
      return Items != null && Items.length > 0;
    } catch (err) {
      console.error("Error checking global duplicate:", err);
      return false;
    }
  }, "isGlobalDuplicate");
  const saveToGlobalStore = /* @__PURE__ */ __name(async (contentHash, _contentType) => {
    if (!isGlobalEnabled) return;
    try {
      const params = {
        TableName: TABLE_NAME,
        Item: {
          contentHash,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          deviceId: window.textsecure.storage.user.getDeviceId(),
          userId: window.textsecure.storage.user.getNumber()
        }
      };
      await docClient.send(new import_lib_dynamodb.PutCommand(params));
    } catch (err) {
      console.error("Error saving to global store:", err);
    }
  }, "saveToGlobalStore");
  const handleImageAttachment = /* @__PURE__ */ __name(async (attachment) => {
    if (!isEnabled) return true;
    try {
      const imageHash = await (0, import_imageHash.getImageHash)(attachment.data);
      const localDup = await isLocalDuplicate(imageHash, "image");
      const globalDup = await isGlobalDuplicate(imageHash, "image");
      if (localDup || globalDup) {
        const next = { ...stats, imagesBlocked: stats.imagesBlocked + 1 };
        setStats(next);
        await window.Signal.Data.saveFilterStats(next);
        return false;
      }
      await window.Signal.Data.saveContentHash({
        hash: imageHash,
        contentType: "image",
        timestamp: Date.now()
      });
      await saveToGlobalStore(imageHash, "image");
      return true;
    } catch {
      return true;
    }
  }, "handleImageAttachment");
  const handleTextMessage = /* @__PURE__ */ __name(async (text) => {
    if (!isEnabled || !text || text.length < 5) return true;
    try {
      const textHash = crypto.createHash("sha256").update(text).digest("hex");
      const localDup = await isLocalDuplicate(textHash, "text");
      const globalDup = await isGlobalDuplicate(textHash, "text");
      if (localDup || globalDup) {
        const next = { ...stats, textsBlocked: stats.textsBlocked + 1 };
        setStats(next);
        await window.Signal.Data.saveFilterStats(next);
        return false;
      }
      await window.Signal.Data.saveContentHash({
        hash: textHash,
        contentType: "text",
        timestamp: Date.now()
      });
      await saveToGlobalStore(textHash, "text");
      return true;
    } catch {
      return true;
    }
  }, "handleTextMessage");
  (0, import_react.useEffect)(() => {
    if (window.Signal?.Services) {
      ;
      window.Signal.Services.filterService = {
        handleImageAttachment,
        handleTextMessage
      };
    }
  }, [isEnabled, isGlobalEnabled]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "module-filter-tab", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { className: "module-filter-tab__header", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: i18n("icu:FilterTab__title") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "module-filter-tab__settings", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "checkbox",
            checked: isEnabled,
            onChange: () => setIsEnabled((e) => !e)
          }
        ),
        i18n("icu:FilterTab__enableFilter")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "input",
          {
            type: "checkbox",
            checked: isGlobalEnabled,
            disabled: !isEnabled,
            onChange: () => setIsGlobalEnabled((e) => !e)
          }
        ),
        i18n("icu:FilterTab__enableGlobalFilter")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: i18n("icu:FilterTab__globalFilterDescription") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "module-filter-tab__stats", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: i18n("icu:FilterTab__stats") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        i18n("icu:FilterTab__imagesBlocked"),
        ": ",
        stats.imagesBlocked
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        i18n("icu:FilterTab__textsBlocked"),
        ": ",
        stats.textsBlocked
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        i18n("icu:FilterTab__videosBlocked"),
        ": ",
        stats.videosBlocked
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "module-filter-tab__conversations", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: i18n("icu:FilterTab__conversations") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: i18n("icu:FilterTab__conversationsDescription") }),
      conversations.map((c) => {
        const excluded = c.filterExcluded ?? false;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              type: "checkbox",
              checked: !excluded,
              onChange: () => window.Signal.Data.updateConversation(c.id, {
                filterExcluded: !excluded
              })
            }
          ),
          c.title || c.name || c.phoneNumber
        ] }) }, c.id);
      })
    ] })
  ] });
}, "FilterTab");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FilterTab
});

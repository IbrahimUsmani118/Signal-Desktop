"use strict";
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
var FilterService_exports = {};
__export(FilterService_exports, {
  FilterService: () => FilterService
});
module.exports = __toCommonJS(FilterService_exports);
var import_imageHash = require("./imageHash");
var import_textFilter = require("./textFilter");
var crypto = __toESM(require("crypto"));
class FilterService {
  // Percentage threshold for similarity
  constructor() {
    this.isEnabled = true;
    this.isGlobalEnabled = true;
    this.similarityThreshold = 90;
    this.loadSettings();
  }
  static {
    __name(this, "FilterService");
  }
  async loadSettings() {
    try {
      const settings = await window.Signal.Data.getFilterSettings();
      if (settings) {
        this.isEnabled = settings.isEnabled;
        this.isGlobalEnabled = settings.isGlobalEnabled;
        this.similarityThreshold = settings.similarityThreshold || 90;
      }
    } catch (error) {
      console.error("Failed to load filter settings:", error);
    }
  }
  async handleImageAttachment(attachment) {
    if (!this.isEnabled || !attachment || !attachment.data) {
      return true;
    }
    try {
      const imageHash = await (0, import_imageHash.getImageHash)(attachment.data);
      const localHashes = await window.Signal.Data.getContentHashes("image");
      for (const hash of localHashes) {
        const similarity = (0, import_imageHash.compareImageHashes)(imageHash, hash.hash);
        if (similarity >= this.similarityThreshold) {
          console.log(`Blocked duplicate image (${similarity}% similar)`);
          return false;
        }
      }
      if (this.isGlobalEnabled) {
        const isGlobalDuplicate = await this.checkGlobalDuplicate(imageHash, "image");
        if (isGlobalDuplicate) {
          console.log("Blocked globally duplicate image");
          return false;
        }
      }
      await window.Signal.Data.saveContentHash({
        hash: imageHash,
        contentType: "image",
        timestamp: Date.now()
      });
      if (this.isGlobalEnabled) {
        await this.saveToGlobalStore(imageHash, "image");
      }
      return true;
    } catch (error) {
      console.error("Error handling image attachment:", error);
      return true;
    }
  }
  async handleTextMessage(text) {
    if (!this.isEnabled || !text || text.length < 5) {
      return true;
    }
    try {
      const textHash = crypto.createHash("sha256").update(text).digest("hex");
      const localHashes = await window.Signal.Data.getContentHashes("text");
      for (const hash of localHashes) {
        const similarity = (0, import_textFilter.getTextSimilarity)(text, hash.content || "");
        if (hash.hash === textHash || similarity >= this.similarityThreshold) {
          console.log(`Blocked duplicate text (${similarity}% similar)`);
          return false;
        }
      }
      if (this.isGlobalEnabled) {
        const isGlobalDuplicate = await this.checkGlobalDuplicate(textHash, "text");
        if (isGlobalDuplicate) {
          console.log("Blocked globally duplicate text");
          return false;
        }
      }
      await window.Signal.Data.saveContentHash({
        hash: textHash,
        contentType: "text",
        timestamp: Date.now(),
        content: text
        // Save the actual text for similarity checking
      });
      if (this.isGlobalEnabled) {
        await this.saveToGlobalStore(textHash, "text");
      }
      return true;
    } catch (error) {
      console.error("Error handling text message:", error);
      return true;
    }
  }
  async handleVideoAttachment(attachment) {
    return true;
  }
  async checkGlobalDuplicate(contentHash, contentType) {
    try {
      const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
      const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
      const client = new DynamoDBClient({ region: "us-east-1" });
      const docClient = DynamoDBDocumentClient.from(client);
      const params = {
        TableName: "SignalContentHashes",
        KeyConditionExpression: "contentHash = :hash",
        ExpressionAttributeValues: {
          ":hash": contentHash
        }
      };
      const { Items } = await docClient.send(new QueryCommand(params));
      return Items && Items.length > 0;
    } catch (error) {
      console.error("Error checking global duplicate:", error);
      return false;
    }
  }
  async saveToGlobalStore(contentHash, contentType) {
    try {
      const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
      const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
      const client = new DynamoDBClient({ region: "us-east-1" });
      const docClient = DynamoDBDocumentClient.from(client);
      const params = {
        TableName: "SignalContentHashes",
        Item: {
          contentHash,
          contentType,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          deviceId: window.textsecure.storage.user.getDeviceId(),
          userId: window.textsecure.storage.user.getNumber()
        }
      };
      await docClient.send(new PutCommand(params));
    } catch (error) {
      console.error("Error saving to global store:", error);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FilterService
});

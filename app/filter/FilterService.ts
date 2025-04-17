import { getImageHash, compareImageHashes } from "./imageHash"
import { getTextSimilarity } from "./textFilter"
import * as crypto from "crypto"

export class FilterService {
  private isEnabled = true
  private isGlobalEnabled = true
  private similarityThreshold = 90 // Percentage threshold for similarity

  constructor() {
    this.loadSettings()
  }

  private async loadSettings(): Promise<void> {
    try {
      const settings = await window.Signal.Data.getFilterSettings()
      if (settings) {
        this.isEnabled = settings.isEnabled
        this.isGlobalEnabled = settings.isGlobalEnabled
        this.similarityThreshold = settings.similarityThreshold || 90
      }
    } catch (error) {
      console.error("Failed to load filter settings:", error)
    }
  }

  public async handleImageAttachment(attachment: any): Promise<boolean> {
    if (!this.isEnabled || !attachment || !attachment.data) {
      return true // Allow if filter is disabled or no data
    }

    try {
      // Generate hash for the image
      const imageHash = await getImageHash(attachment.data)

      // Check local database for duplicates
      const localHashes = await window.Signal.Data.getContentHashes("image")
      for (const hash of localHashes) {
        const similarity = compareImageHashes(imageHash, hash.hash)
        if (similarity >= this.similarityThreshold) {
          console.log(`Blocked duplicate image (${similarity}% similar)`)
          return false // Block the image
        }
      }

      // Check global database if enabled
      if (this.isGlobalEnabled) {
        const isGlobalDuplicate = await this.checkGlobalDuplicate(imageHash, "image")
        if (isGlobalDuplicate) {
          console.log("Blocked globally duplicate image")
          return false // Block the image
        }
      }

      // If not a duplicate, save the hash
      await window.Signal.Data.saveContentHash({
        hash: imageHash,
        contentType: "image",
        timestamp: Date.now(),
      })

      // Save to global store if enabled
      if (this.isGlobalEnabled) {
        await this.saveToGlobalStore(imageHash, "image")
      }

      return true // Allow the image
    } catch (error) {
      console.error("Error handling image attachment:", error)
      return true // Allow on error
    }
  }

  public async handleTextMessage(text: string): Promise<boolean> {
    if (!this.isEnabled || !text || text.length < 5) {
      return true // Allow if filter is disabled or text is too short
    }

    try {
      // Generate hash for the text
      const textHash = crypto.createHash("sha256").update(text).digest("hex")

      // Check local database for duplicates
      const localHashes = await window.Signal.Data.getContentHashes("text")
      for (const hash of localHashes) {
        // For text, we can also check content similarity
        const similarity = getTextSimilarity(text, hash.content || "")
        if (hash.hash === textHash || similarity >= this.similarityThreshold) {
          console.log(`Blocked duplicate text (${similarity}% similar)`)
          return false // Block the text
        }
      }

      // Check global database if enabled
      if (this.isGlobalEnabled) {
        const isGlobalDuplicate = await this.checkGlobalDuplicate(textHash, "text")
        if (isGlobalDuplicate) {
          console.log("Blocked globally duplicate text")
          return false // Block the text
        }
      }

      // If not a duplicate, save the hash and content
      await window.Signal.Data.saveContentHash({
        hash: textHash,
        contentType: "text",
        timestamp: Date.now(),
        content: text, // Save the actual text for similarity checking
      })

      // Save to global store if enabled
      if (this.isGlobalEnabled) {
        await this.saveToGlobalStore(textHash, "text")
      }

      return true // Allow the text
    } catch (error) {
      console.error("Error handling text message:", error)
      return true // Allow on error
    }
  }

  public async handleVideoAttachment(attachment: any): Promise<boolean> {
    // Video filtering is not yet implemented
    // This is a placeholder for future implementation
    return true
  }

  private async checkGlobalDuplicate(contentHash: string, contentType: "image" | "text" | "video"): Promise<boolean> {
    try {
      // Initialize AWS SDK and DynamoDB client
      const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
      const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb")

      const client = new DynamoDBClient({ region: "us-east-1" })
      const docClient = DynamoDBDocumentClient.from(client)

      const params = {
        TableName: "SignalContentHashes",
        KeyConditionExpression: "contentHash = :hash",
        ExpressionAttributeValues: {
          ":hash": contentHash,
        },
      }

      const { Items } = await docClient.send(new QueryCommand(params))
      return Items && Items.length > 0
    } catch (error) {
      console.error("Error checking global duplicate:", error)
      return false
    }
  }

  private async saveToGlobalStore(contentHash: string, contentType: "image" | "text" | "video"): Promise<void> {
    try {
      // Initialize AWS SDK and DynamoDB client
      const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
      const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb")

      const client = new DynamoDBClient({ region: "us-east-1" })
      const docClient = DynamoDBDocumentClient.from(client)

      const params = {
        TableName: "SignalContentHashes",
        Item: {
          contentHash,
          contentType,
          timestamp: new Date().toISOString(),
          deviceId: window.textsecure.storage.user.getDeviceId(),
          userId: window.textsecure.storage.user.getNumber(),
        },
      }

      await docClient.send(new PutCommand(params))
    } catch (error) {
      console.error("Error saving to global store:", error)
    }
  }
}

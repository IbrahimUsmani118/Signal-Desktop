"use client"

import { useState, useEffect } from "react"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import * as crypto from "crypto"
import { getConversations } from "../state/selectors/conversations"
import { useSelector } from "react-redux"
import type { LocalizerType } from "../types/Util"
import { getImageHash } from "./imageHash"
import type { ConversationType } from "../state/ducks/conversations"

// AWS Configuration
const REGION = "us-east-1" // Default region, should be configurable
const TABLE_NAME = "SignalContentHashes"

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: REGION })
const docClient = DynamoDBDocumentClient.from(client)

export type PropsType = {
  i18n: LocalizerType
}

export const FilterTab = ({ i18n }: PropsType): JSX.Element => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true)
  const [isGlobalFilterEnabled, setIsGlobalFilterEnabled] = useState<boolean>(true)
  const [stats, setStats] = useState({
    imagesBlocked: 0,
    textsBlocked: 0,
    videosBlocked: 0,
  })

  const conversations = useSelector(getConversations)

  useEffect(() => {
    // Load filter settings from storage
    const loadSettings = async () => {
      try {
        const settings = await window.Signal.Data.getFilterSettings()
        if (settings) {
          setIsEnabled(settings.isEnabled)
          setIsGlobalFilterEnabled(settings.isGlobalFilterEnabled)
        }
      } catch (error) {
        console.error("Failed to load filter settings:", error)
      }
    }

    // Load filter stats
    const loadStats = async () => {
      try {
        const savedStats = await window.Signal.Data.getFilterStats()
        if (savedStats) {
          setStats(savedStats)
        }
      } catch (error) {
        console.error("Failed to load filter stats:", error)
      }
    }

    loadSettings()
    loadStats()
  }, [])

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await window.Signal.Data.saveFilterSettings({
          isEnabled,
          isGlobalFilterEnabled,
        })
      } catch (error) {
        console.error("Failed to save filter settings:", error)
      }
    }

    saveSettings()
  }, [isEnabled, isGlobalFilterEnabled])

  // Function to check if content is a duplicate (local)
  const isLocalDuplicate = async (contentHash: string, contentType: "image" | "text" | "video"): Promise<boolean> => {
    try {
      const result = await window.Signal.Data.getContentHashByHash(contentHash)
      return !!result
    } catch (error) {
      console.error("Error checking local duplicate:", error)
      return false
    }
  }

  // Function to check if content is a duplicate (global via DynamoDB)
  const isGlobalDuplicate = async (contentHash: string, contentType: "image" | "text" | "video"): Promise<boolean> => {
    if (!isGlobalFilterEnabled) return false

    try {
      const params = {
        TableName: TABLE_NAME,
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

  // Function to save content hash to DynamoDB
  const saveToGlobalStore = async (contentHash: string, contentType: "image" | "text" | "video"): Promise<void> => {
    if (!isGlobalFilterEnabled) return

    try {
      const params = {
        TableName: TABLE_NAME,
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

  // Function to handle image upload/attachment
  const handleImageAttachment = async (attachment: any): Promise<boolean> => {
    if (!isEnabled) return true

    try {
      // Generate hash for the image
      const imageHash = await getImageHash(attachment.data)

      // Check if it's a duplicate locally
      const isLocalDup = await isLocalDuplicate(imageHash, "image")

      // Check if it's a duplicate globally
      const isGlobalDup = await isGlobalDuplicate(imageHash, "image")

      if (isLocalDup || isGlobalDup) {
        // Update stats
        const newStats = {
          ...stats,
          imagesBlocked: stats.imagesBlocked + 1,
        }
        setStats(newStats)
        await window.Signal.Data.saveFilterStats(newStats)

        return false // Block the image
      }

      // If not a duplicate, save the hash
      await window.Signal.Data.saveContentHash({
        hash: imageHash,
        contentType: "image",
        timestamp: Date.now(),
      })

      // Save to global store
      await saveToGlobalStore(imageHash, "image")

      return true // Allow the image
    } catch (error) {
      console.error("Error handling image attachment:", error)
      return true // Allow on error
    }
  }

  // Function to handle text messages
  const handleTextMessage = async (text: string): Promise<boolean> => {
    if (!isEnabled || !text || text.length < 5) return true

    try {
      // Generate hash for the text
      const textHash = crypto.createHash("sha256").update(text).digest("hex")

      // Check if it's a duplicate locally
      const isLocalDup = await isLocalDuplicate(textHash, "text")

      // Check if it's a duplicate globally
      const isGlobalDup = await isGlobalDuplicate(textHash, "text")

      if (isLocalDup || isGlobalDup) {
        // Update stats
        const newStats = {
          ...stats,
          textsBlocked: stats.textsBlocked + 1,
        }
        setStats(newStats)
        await window.Signal.Data.saveFilterStats(newStats)

        return false // Block the text
      }

      // If not a duplicate, save the hash
      await window.Signal.Data.saveContentHash({
        hash: textHash,
        contentType: "text",
        timestamp: Date.now(),
      })

      // Save to global store
      await saveToGlobalStore(textHash, "text")

      return true // Allow the text
    } catch (error) {
      console.error("Error handling text message:", error)
      return true // Allow on error
    }
  }

  // Register the filter handlers with the main app
  useEffect(() => {
    if (window.Signal && window.Signal.Services) {
      window.Signal.Services.filterService = {
        handleImageAttachment,
        handleTextMessage,
      }
    }
  }, [isEnabled, isGlobalFilterEnabled])

  return (
    <div className="module-filter-tab">
      <div className="module-filter-tab__header">
        <h2>{i18n("icu:FilterTab__title")}</h2>
      </div>

      <div className="module-filter-tab__settings">
        <div className="module-filter-tab__setting">
          <input type="checkbox" id="filter-enabled" checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)} />
          <label htmlFor="filter-enabled">{i18n("icu:FilterTab__enableFilter")}</label>
        </div>

        <div className="module-filter-tab__setting">
          <input
            type="checkbox"
            id="global-filter-enabled"
            checked={isGlobalFilterEnabled}
            onChange={() => setIsGlobalFilterEnabled(!isGlobalFilterEnabled)}
            disabled={!isEnabled}
          />
          <label htmlFor="global-filter-enabled">{i18n("icu:FilterTab__enableGlobalFilter")}</label>
          <p className="module-filter-tab__description">{i18n("icu:FilterTab__globalFilterDescription")}</p>
        </div>
      </div>

      <div className="module-filter-tab__stats">
        <h3>{i18n("icu:FilterTab__stats")}</h3>
        <div className="module-filter-tab__stat">
          <span>{i18n("icu:FilterTab__imagesBlocked")}</span>
          <span>{stats.imagesBlocked}</span>
        </div>
        <div className="module-filter-tab__stat">
          <span>{i18n("icu:FilterTab__textsBlocked")}</span>
          <span>{stats.textsBlocked}</span>
        </div>
        <div className="module-filter-tab__stat">
          <span>{i18n("icu:FilterTab__videosBlocked")}</span>
          <span>{stats.videosBlocked}</span>
        </div>
      </div>

      <div className="module-filter-tab__conversations">
        <h3>{i18n("icu:FilterTab__conversations")}</h3>
        <p>{i18n("icu:FilterTab__conversationsDescription")}</p>
        <div className="module-filter-tab__conversation-list">
          {conversations.map((conversation: ConversationType) => (
            <div key={conversation.id} className="module-filter-tab__conversation">
              <input
                type="checkbox"
                id={`conversation-${conversation.id}`}
                checked={!conversation.filterExcluded}
                onChange={() => {
                  // Toggle filter exclusion for this conversation
                  window.Signal.Data.updateConversation(conversation.id, {
                    filterExcluded: !conversation.filterExcluded,
                  })
                }}
              />
              <label htmlFor={`conversation-${conversation.id}`}>
                {conversation.title || conversation.name || conversation.phoneNumber}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

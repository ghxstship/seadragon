// Real-time communication server using WebSockets
// Handles live updates, notifications, and collaborative features

import { logger } from './logger'
import { safeJsonParse } from './safe-json'
import { WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { workflowStateManager } from '@/lib/workflow-state-manager'
import { dataSyncManager } from '@/lib/integrations/sync-manager'

/// <reference path="../types/testing-library-matchers.d.ts" />

// WebSocket connection store
const connections = new Map<string, WebSocket>()
const userConnections = new Map<string, Set<WebSocket>>()
const roomConnections = new Map<string, Set<WebSocket>>()

export interface RealTimeMessage {
  type: string
  payload: unknown
  userId?: string
  roomId?: string
  timestamp: Date
}

// Message types
export const MESSAGE_TYPES = {
  // Workflow events
  WORKFLOW_UPDATED: 'workflow.updated',
  WORKFLOW_TRANSITION: 'workflow.transition',
  WORKFLOW_VALIDATION: 'workflow.validation',

  // Integration events
  INTEGRATION_SYNC_STARTED: 'integration.sync.started',
  INTEGRATION_SYNC_COMPLETED: 'integration.sync.completed',
  INTEGRATION_SYNC_FAILED: 'integration.sync.failed',
  WEBHOOK_RECEIVED: 'webhook.received',

  // Collaboration events
  USER_JOINED_ROOM: 'user.joined.room',
  USER_LEFT_ROOM: 'user.left.room',
  COLLABORATION_UPDATE: 'collaboration.update',

  // Notification events
  NOTIFICATION_NEW: 'notification.new',
  NOTIFICATION_READ: 'notification.read',

  // System events
  SYSTEM_MAINTENANCE: 'system.maintenance',
  SYSTEM_ERROR: 'system.error'
} as const

// WebSocket handler - accepts an already upgraded WebSocket connection
export function handleWebSocket(ws: WebSocket) {
  const connectionId = generateConnectionId()

  connections.set(connectionId, ws)

  ws.onopen = () => {
    logger.info('WebSocket connection opened', { connectionId })
  }

  ws.onmessage = async (event) => {
    try {
      let data: string
      if (typeof event.data === 'string') {
        data = event.data
      } else if (event.data instanceof ArrayBuffer) {
        data = new TextDecoder().decode(event.data)
      } else if (event.data instanceof Buffer) {
        data = event.data.toString()
      } else {
        throw new Error('Unsupported message data type')
      }

      const message: RealTimeMessage = safeJsonParse(data)
      if (!message) {
        logger.warn('Invalid realtime message format', { data: data.substring(0, 100) })
        return
      }
      await handleMessage(ws, message)
    } catch (error) {
      logger.error('Error handling WebSocket message', error)
      ws.send(JSON.stringify({
        type: 'error',
        payload: { message: 'Invalid message format' },
        timestamp: new Date()
      }))
    }
  }

  ws.onclose = () => {
    logger.info('WebSocket connection closed', { connectionId })
    connections.delete(connectionId)

    // Remove from user connections
    for (const [userId, userSockets] of userConnections) {
      userSockets.delete(ws)
      if (userSockets.size === 0) {
        userConnections.delete(userId)
      }
    }

    // Remove from room connections
    for (const [roomId, roomSockets] of roomConnections) {
      roomSockets.delete(ws)
      if (roomSockets.size === 0) {
        roomConnections.delete(roomId)
      }
    }
  }

  ws.onerror = (error) => {
    logger.error('WebSocket error', { connectionId, error })
  }
}

// Handle incoming messages
async function handleMessage(ws: WebSocket, message: RealTimeMessage) {
  const { type, payload, userId, roomId } = message

  // Authenticate user (in production, validate JWT token)
  if (!userId) {
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: 'User authentication required' },
      timestamp: new Date()
    }))
    return
  }

  // Add to user connections
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set())
  }
  userConnections.get(userId)!.add(ws)

  // Add to room if specified
  if (roomId) {
    if (!roomConnections.has(roomId)) {
      roomConnections.set(roomId, new Set())
    }
    roomConnections.get(roomId)!.add(ws)
  }

  switch (type) {
    case 'join_room':
      handleJoinRoom(ws, userId, payload.roomId)
      break

    case 'leave_room':
      handleLeaveRoom(ws, userId, payload.roomId)
      break

    case 'workflow_subscribe':
      handleWorkflowSubscription(ws, userId, payload.workflowId)
      break

    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        payload: { timestamp: new Date() },
        timestamp: new Date()
      }))
      break

    default:
      logger.warn('Unknown message type', { type })
  }
}

// Handle room joining
function handleJoinRoom(ws: WebSocket, userId: string, roomId: string) {
  if (!roomConnections.has(roomId)) {
    roomConnections.set(roomId, new Set())
  }
  roomConnections.get(roomId)!.add(ws)

  // Notify room members
  broadcastToRoom(roomId, {
    type: MESSAGE_TYPES.USER_JOINED_ROOM,
    payload: { userId, roomId },
    timestamp: new Date()
  }, [ws]) // Exclude the joining user

  ws.send(JSON.stringify({
    type: 'room_joined',
    payload: { roomId },
    timestamp: new Date()
  }))
}

// Handle room leaving
function handleLeaveRoom(ws: WebSocket, userId: string, roomId: string) {
  const roomSockets = roomConnections.get(roomId)
  if (roomSockets) {
    roomSockets.delete(ws)
    if (roomSockets.size === 0) {
      roomConnections.delete(roomId)
    }

    // Notify remaining room members
    broadcastToRoom(roomId, {
      type: MESSAGE_TYPES.USER_LEFT_ROOM,
      payload: { userId, roomId },
      timestamp: new Date()
    })
  }
}

// Handle workflow subscription
async function handleWorkflowSubscription(ws: WebSocket, userId: string, workflowId: string) {
  try {
    // Subscribe to workflow updates (in production, store subscription)
    logger.info('User subscribed to workflow', { userId, workflowId })

    ws.send(JSON.stringify({
      type: 'workflow_subscribed',
      payload: { workflowId },
      timestamp: new Date()
    }))
  } catch (error) {
    logger.error('Error subscribing to workflow', error)
    ws.send(JSON.stringify({
      type: 'error',
      payload: { message: 'Failed to subscribe to workflow' },
      timestamp: new Date()
    }))
  }
}

// Broadcast to specific user
export function broadcastToUser(userId: string, message: RealTimeMessage) {
  const userSockets = userConnections.get(userId)
  if (userSockets) {
    const messageStr = JSON.stringify(message)
    userSockets.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageStr)
      }
    })
  }
}

// Broadcast to room
export function broadcastToRoom(roomId: string, message: RealTimeMessage, excludeSockets: WebSocket[] = []) {
  const roomSockets = roomConnections.get(roomId)
  if (roomSockets) {
    const messageStr = JSON.stringify(message)
    roomSockets.forEach(socket => {
      if (socket.readyState === WebSocket.OPEN && !excludeSockets.includes(socket)) {
        socket.send(messageStr)
      }
    })
  }
}

// Broadcast to all connected clients
export function broadcastToAll(message: RealTimeMessage, excludeSockets: WebSocket[] = []) {
  const messageStr = JSON.stringify(message)
  connections.forEach((socket, connectionId) => {
    if (socket.readyState === WebSocket.OPEN && !excludeSockets.includes(socket)) {
      socket.send(messageStr)
    }
  })
}

// Send workflow update notifications
export async function notifyWorkflowUpdate(workflowId: string, updateType: string, data: unknown) {
  broadcastToAll({
    type: MESSAGE_TYPES.WORKFLOW_UPDATED,
    payload: {
      workflowId,
      updateType,
      data,
      timestamp: new Date()
    },
    timestamp: new Date()
  })
}

// Send workflow transition notifications
export async function notifyWorkflowTransition(workflowId: string, transition: unknown) {
  broadcastToAll({
    type: MESSAGE_TYPES.WORKFLOW_TRANSITION,
    payload: {
      workflowId,
      transition,
      timestamp: new Date()
    },
    timestamp: new Date()
  })
}

// Send integration sync notifications
export async function notifyIntegrationSync(providerId: string, status: string, data?: unknown) {
  const messageType = status === 'started'
    ? MESSAGE_TYPES.INTEGRATION_SYNC_STARTED
    : status === 'completed'
    ? MESSAGE_TYPES.INTEGRATION_SYNC_COMPLETED
    : MESSAGE_TYPES.INTEGRATION_SYNC_FAILED

  broadcastToAll({
    type: messageType,
    payload: {
      providerId,
      status,
      data,
      timestamp: new Date()
    },
    timestamp: new Date()
  })
}

// Send webhook notifications
export async function notifyWebhookReceived(providerId: string, eventType: string, data?: unknown) {
  broadcastToAll({
    type: MESSAGE_TYPES.WEBHOOK_RECEIVED,
    payload: {
      providerId,
      eventType,
      data,
      timestamp: new Date()
    },
    timestamp: new Date()
  })
}

// Send collaboration updates
export async function notifyCollaborationUpdate(roomId: string, userId: string, action: string, data: unknown) {
  broadcastToRoom(roomId, {
    type: MESSAGE_TYPES.COLLABORATION_UPDATE,
    payload: {
      userId,
      action,
      data,
      timestamp: new Date()
    },
    roomId,
    timestamp: new Date()
  })
}

// Send notifications to users
export async function sendNotification(userId: string, notification: unknown) {
  broadcastToUser(userId, {
    type: MESSAGE_TYPES.NOTIFICATION_NEW,
    payload: notification,
    userId,
    timestamp: new Date()
  })
}

// System maintenance notifications
export async function notifySystemMaintenance(message: string, estimatedDowntime?: number) {
  broadcastToAll({
    type: MESSAGE_TYPES.SYSTEM_MAINTENANCE,
    payload: {
      message,
      estimatedDowntime,
      timestamp: new Date()
    },
    timestamp: new Date()
  })
}

// System error notifications
export async function notifySystemError(error: string, context?: unknown) {
  broadcastToAll({
    type: MESSAGE_TYPES.SYSTEM_ERROR,
    payload: {
      error,
      context,
      timestamp: new Date()
    },
    timestamp: new Date()
  })
}

// Connection management
export function getConnectionStats() {
  return {
    totalConnections: connections.size,
    userConnections: userConnections.size,
    roomConnections: roomConnections.size,
    rooms: Array.from(roomConnections.keys())
  }
}

function generateConnectionId(): string {
  return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Cleanup function for development
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(() => {
    // Clean up closed connections
    for (const [connectionId, socket] of connections) {
      if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
        connections.delete(connectionId)
      }
    }
  }, 30000) // Clean up every 30 seconds
}

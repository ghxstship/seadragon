/**
 * User Service
 * Centralized API calls for user-related operations
 */

import { apiClient } from '@/lib/api-client'
import { logger } from '@/lib/logger'

export interface UserProfile {
  first_name: string
  last_name: string
  email: string
  username: string
  phone: string
  bio: string
  location: string
  website: string
}

export interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  theme: string
  language: string
  timezone: string
}

export interface UserSecurity {
  mfaEnabled: boolean
  sessionTimeout: number
  loginAlerts: boolean
}

export interface UserData {
  user: UserProfile & {
    preferences?: UserPreferences
    security?: UserSecurity
  }
}

/**
 * Get current user profile and settings
 */
export async function getUserProfile(): Promise<UserData> {
  try {
    const response = await apiClient.get('/api/v1/users/me')
    if (!response.ok) {
      throw new Error(response.error || 'Failed to fetch user profile')
    }
    return response.data
  } catch (error) {
    logger.error('Error fetching user profile', error)
    throw error
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
  try {
    const response = await apiClient.patch('/api/v1/users/me', profileData)
    if (!response.ok) {
      throw new Error(response.error || 'Failed to update user profile')
    }
    logger.action('save_profile', { profileData })
  } catch (error) {
    logger.error('Error updating user profile', error)
    throw error
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(preferences: UserPreferences): Promise<void> {
  try {
    const response = await apiClient.patch('/api/v1/users/me', { preferences })
    if (!response.ok) {
      throw new Error(response.error || 'Failed to update user preferences')
    }
    logger.action('save_preferences', { preferences })
  } catch (error) {
    logger.error('Error updating user preferences', error)
    throw error
  }
}

/**
 * Update user security settings
 */
export async function updateUserSecurity(security: UserSecurity): Promise<void> {
  try {
    const response = await apiClient.patch('/api/v1/users/me', { security })
    if (!response.ok) {
      throw new Error(response.error || 'Failed to update user security settings')
    }
    logger.action('save_security', { security })
  } catch (error) {
    logger.error('Error updating user security settings', error)
    throw error
  }
}

/**
 * Request user data export
 */
export async function exportUserData(): Promise<void> {
  try {
    const response = await apiClient.post('/api/v1/users/me/export')
    if (!response.ok) {
      throw new Error(response.error || 'Failed to request data export')
    }
  } catch (error) {
    logger.error('Error requesting user data export', error)
    throw error
  }
}

/**
 * Delete user account
 */
export async function deleteUserAccount(): Promise<void> {
  try {
    const response = await apiClient.delete('/api/v1/users/me')
    if (!response.ok) {
      throw new Error(response.error || 'Failed to delete user account')
    }
  } catch (error) {
    logger.error('Error deleting user account', error)
    throw error
  }
}

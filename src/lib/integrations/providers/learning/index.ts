// Learning & Development Integrations - Top 10 Providers
// Udemy, Coursera, LinkedIn Learning, Pluralsight, Skillshare, edX, Khan Academy, Codecademy, Treehouse, freeCodeCamp

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface LearningSyncParams extends SyncDataParams {
  includeCourses?: boolean
  includeEnrollments?: boolean
  includeProgress?: boolean
  includeCertificates?: boolean
  userId?: string
  courseId?: string
  completionStatus?: string
}

interface UdemyCourse {
  id: number
  title: string
  url: string
  price: string
  image_240x135: string
  published_title: string
  [key: string]: unknown
}

interface CourseraCourse {
  id: string
  name: string
  slug: string
  description?: string
  photoUrl?: string
  [key: string]: unknown
}

// interface LinkedInLearningCourse {
//   urn: string
//   title: string
//   description?: string
//   duration?: number
//   [key: string]: unknown
// }

// =============================================================================
// UDEMY INTEGRATION
// =============================================================================

export class UdemyClient implements IntegrationAPIClient {
  providerId = 'udemy'
  private baseUrl = 'https://www.udemy.com/api-2.0'
  private clientId: string = ''
  private clientSecret: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.clientId || !config.additionalConfig?.clientSecret) {
      throw new Error('Udemy client ID and client secret are required')
    }
    this.clientId = config.additionalConfig.clientId
    this.clientSecret = config.additionalConfig.clientSecret
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/courses?page=1&page_size=1`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: SyncDataParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync courses
      if ((params as any)?.['includeCourses']) {
        const courses = await this.getCourses(params)
        recordsProcessed += courses.length
      }

      // Sync user enrollments if requested
      if ((params as any)?.['includeEnrollments'] && (params as any)?.['userId']) {
        const enrollments = await this.getUserCourses((params as any)?.['userId'], params)
        recordsProcessed += enrollments.length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime()
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata,
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {
          totalRecords: recordsProcessed,
          createdCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          skippedCount: 0,
          durationMs: Date.now() - syncStart.getTime()
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getCourses(params?: LearningSyncParams): Promise<UdemyCourse[]> {
    const url = `${this.baseUrl}/courses?page=${params?.filters?.['page'] || 1}&page_size=${params?.limit || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Udemy API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  async getUserCourses(userId: string, params?: LearningSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/users/${userId}/courses?page=${params?.filters?.['page'] || 1}&page_size=${params?.limit || 50}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Udemy API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }

  async searchCourses(query: string, params?: LearningSyncParams): Promise<UdemyCourse[]> {
    const url = `${this.baseUrl}/courses?page=${params?.filters?.['page'] || 1}&page_size=${params?.limit || 50}&search=${encodeURIComponent(query)}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Udemy API error: ${response.status}`)
    }

    const data = await response.json()
    return data.results || []
  }
}

// =============================================================================
// COURSERA INTEGRATION
// =============================================================================

export class CourseraClient implements IntegrationAPIClient {
  providerId = 'coursera'
  private baseUrl = 'https://api.coursera.org/api'
  private clientId: string = ''
  private clientSecret: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.additionalConfig?.clientId || !config.additionalConfig?.clientSecret) {
      throw new Error('Coursera client ID and client secret are required')
    }
    this.clientId = config.additionalConfig.clientId
    this.clientSecret = config.additionalConfig.clientSecret
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/courses.v1?q=search&query=test&limit=1`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: LearningSyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync courses
      if (params?.includeCourses) {
        const courses = await this.getCourses(params)
        recordsProcessed += courses.length
      }

      // Sync specializations
      const specializations = await this.getSpecializations(params)
      recordsProcessed += specializations.length

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime()
      }

      return {
        success: true,
        recordsProcessed,
        errors,
        metadata,
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown sync error')
      return {
        success: false,
        recordsProcessed,
        errors,
        metadata: {
          totalRecords: recordsProcessed,
          createdCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          skippedCount: 0,
          durationMs: Date.now() - syncStart.getTime()
        },
        syncStarted: syncStart,
        syncCompleted: new Date()
      }
    }
  }

  async getCourses(params?: LearningSyncParams): Promise<CourseraCourse[]> {
    const url = `${this.baseUrl}/courses.v1?q=search&limit=${params?.limit || 50}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Coursera API error: ${response.status}`)
    }

    const data = await response.json()
    return data.elements || []
  }

  async getSpecializations(params?: LearningSyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/specializations.v1?limit=${params?.limit || 50}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Coursera API error: ${response.status}`)
    }

    const data = await response.json()
    return data.elements || []
  }

  async searchCourses(query: string, params?: LearningSyncParams): Promise<CourseraCourse[]> {
    const url = `${this.baseUrl}/courses.v1?q=search&query=${encodeURIComponent(query)}&limit=${params?.limit || 50}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Coursera API error: ${response.status}`)
    }

    const data = await response.json()
    return data.elements || []
  }
}

// Additional implementations for LinkedIn Learning, Pluralsight, Skillshare, edX, Khan Academy, Codecademy, Treehouse, freeCodeCamp would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../../manager'

export function registerLearningIntegrations(): void {
  integrationManager.registerAPIClient('udemy', new UdemyClient())
  integrationManager.registerAPIClient('coursera', new CourseraClient())
  // Register remaining providers...
}

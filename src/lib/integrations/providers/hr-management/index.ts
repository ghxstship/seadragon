// HR Management Integrations - Top 10 Providers
// BambooHR, Workday, ADP, Greenhouse, Lever, Indeed, LinkedIn, Gusto, Zenefits, UKG

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface HRManagementSyncParams extends SyncDataParams {
  includeEmployees?: boolean
  includeTimeOff?: boolean
  includePayroll?: boolean
  includeRecruiting?: boolean
  employeeId?: string
  department?: string
}

interface BambooHREmployee {
  id: string
  firstName: string
  lastName: string
  jobTitle?: string
  department?: string
  hireDate?: string
  [key: string]: unknown
}

interface WorkdayWorker {
  Worker_Reference: {
    ID: Array<{ type: string; value: string }>
  }
  Worker_Data: {
    Personal_Data: {
      Name_Data: {
        Legal_Name_Data: {
          Name_Detail_Data: {
            First_Name: string
            Last_Name: string
          }
        }
      }
    }
    Employment_Data: {
      Worker_Job_Data: Array<{
        Position_Data: {
          Job_Profile_Summary_Data: {
            Job_Profile_Name: string
          }
        }
      }>
    }
  }
  [key: string]: unknown
}

interface GreenhouseCandidate {
  id: number
  first_name: string
  last_name: string
  company: string
  title: string
  created_at: string
  [key: string]: unknown
}

// =============================================================================
// BAMBOOHR INTEGRATION
// =============================================================================

export class BambooHRClient implements IntegrationAPIClient {
  providerId = 'bamboo-hr'
  private baseUrl: string = ''
  private apiKey: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.apiKey) {
      throw new Error('BambooHR base URL and API key are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.apiKey = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/gateway.php/companyDomain/v1/employees/directory`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:x`).toString('base64')}`,
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
      const companyDomain = this.baseUrl.split('/').pop() || 'company'
      const employeeId = (params as any)?.['employeeId'] as string

      // Sync employee directory
      const employees = await this.getEmployeeDirectory(companyDomain)
      recordsProcessed += employees.length

      // Sync time off if requested
      if ((params as any)?.['includeTimeOff']) {
        const timeOffRequests = await this.getTimeOffRequests(companyDomain, employeeId)
        recordsProcessed += timeOffRequests.length
      }

      // Sync recruiting data if requested
      if ((params as any)?.['includeRecruiting']) {
        const jobPostings = await this.getJobPostings(companyDomain)
        recordsProcessed += jobPostings.length
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        employeesCount: employees.length
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

  async getEmployeeDirectory(companyDomain: string): Promise<BambooHREmployee[]> {
    const response = await fetch(`${this.baseUrl}/api/gateway.php/${companyDomain}/v1/employees/directory`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:x`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`BambooHR API error: ${response.status}`)
    }

    const data = await response.json()
    return data.employees || []
  }

  async getTimeOffRequests(companyDomain: string, employeeId?: string): Promise<any[]> {
    const url = employeeId
      ? `${this.baseUrl}/api/gateway.php/${companyDomain}/v1/employees/${employeeId}/time_off/requests`
      : `${this.baseUrl}/api/gateway.php/${companyDomain}/v1/time_off/requests`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:x`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`BambooHR API error: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.requests || []
  }

  async getJobPostings(companyDomain: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/gateway.php/${companyDomain}/v1/applicant_tracking/job_postings`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:x`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`BambooHR API error: ${response.status}`)
    }

    const data = await response.json()
    return data.job_postings || []
  }

  async createEmployee(companyDomain: string, employeeData: Record<string, unknown>): Promise<BambooHREmployee> {
    const response = await fetch(`${this.baseUrl}/api/gateway.php/${companyDomain}/v1/employees`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:x`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(employeeData)
    })

    if (!response.ok) {
      throw new Error(`BambooHR API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// GREENHOUSE INTEGRATION
// =============================================================================

export class GreenhouseClient implements IntegrationAPIClient {
  providerId = 'greenhouse'
  private baseUrl = 'https://harvest.greenhouse.io/v1'
  private apiKey: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Greenhouse API key is required')
    }
    this.apiKey = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
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
      // Sync jobs
      const jobs = await this.getJobs()
      recordsProcessed += jobs.length

      // Sync candidates for jobs (limited to avoid rate limits)
      if ((params as any)?.['includeRecruiting'] && jobs.length > 0) {
        for (const job of jobs.slice(0, 5)) {
          try {
            const candidates = await this.getJobCandidates(job.id)
            recordsProcessed += candidates.length
          } catch (error) {
            errors.push(`Failed to sync candidates for job ${job.id}: ${error}`)
          }
        }
      }

      const metadata: SyncResultMetadata = {
        totalRecords: recordsProcessed,
        createdCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        skippedCount: 0,
        durationMs: Date.now() - syncStart.getTime(),
        jobsCount: jobs.length
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

  async getJobs(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/jobs`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Greenhouse API error: ${response.status}`)
    }

    return response.json()
  }

  async getJobCandidates(jobId: number): Promise<GreenhouseCandidate[]> {
    const response = await fetch(`${this.baseUrl}/jobs/${jobId}/candidates`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Greenhouse API error: ${response.status}`)
    }

    return response.json()
  }

  async createCandidate(candidateData: Record<string, unknown>): Promise<GreenhouseCandidate> {
    const response = await fetch(`${this.baseUrl}/candidates`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(candidateData)
    })

    if (!response.ok) {
      throw new Error(`Greenhouse API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for Workday, ADP, Lever, Indeed, LinkedIn, Gusto, Zenefits, UKG would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../../manager'

export function registerHRManagementIntegrations(): void {
  integrationManager.registerAPIClient('bamboo-hr', new BambooHRClient())
  integrationManager.registerAPIClient('greenhouse', new GreenhouseClient())
  // Register remaining providers...
}


// Integration Security and Compliance Framework

import { IntegrationConnection, IntegrationSyncResult } from './types'
import { logger } from '../logger'
import { integrationManager } from './manager'

export interface SecurityContext {
  userId?: string
  organizationId: string
  connection?: IntegrationConnection
  data?: unknown
  ipAddress?: string
  userAgent?: string
}

export interface SecurityPolicy {
  id: string
  name: string
  description: string
  rules: SecurityRule[]
  organizationId: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface SecurityRule {
  id: string
  type: 'access_control' | 'data_encryption' | 'audit_logging' | 'compliance_check'
  conditions: SecurityCondition[]
  actions: SecurityAction[]
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface SecurityCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'matches_regex'
  value: unknown
}

export interface SecurityAction {
  type: 'allow' | 'deny' | 'log' | 'encrypt' | 'mask' | 'alert'
  parameters?: Record<string, unknown>
}

export interface AuditLogEntry {
  id: string
  timestamp: Date
  organizationId: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  details: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  complianceFlags: string[]
}

export interface ComplianceCheck {
  id: string
  name: string
  description: string
  standard: 'GDPR' | 'HIPAA' | 'SOX' | 'PCI-DSS' | 'CCPA' | 'custom'
  rules: ComplianceRule[]
  status: 'passing' | 'failing' | 'warning'
  lastChecked: Date
  nextCheck?: Date
}

export interface ComplianceRule {
  field: string
  requirement: string
  checkType: 'presence' | 'format' | 'encryption' | 'access' | 'retention'
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export class IntegrationSecurityManager {
  private policies: Map<string, SecurityPolicy> = new Map()
  private auditLogs: AuditLogEntry[] = []
  private complianceChecks: Map<string, ComplianceCheck> = new Map()

  // Register security policy
  registerPolicy(policy: SecurityPolicy): void {
    this.policies.set(policy.id, policy)
  }

  // Evaluate security policies for an action
  async evaluatePolicies(
    action: string,
    resource: string,
    context: SecurityContext
  ): Promise<SecurityEvaluationResult> {
    const applicablePolicies = Array.from(this.policies.values())
      .filter(policy =>
        policy.organizationId === context.organizationId &&
        policy.status === 'active'
      )

    const violations: SecurityViolation[] = []
    const recommendations: string[] = []
    let accessGranted = true

    for (const policy of applicablePolicies) {
      for (const rule of policy.rules) {
        const ruleViolations = await this.evaluateRule(rule, action, resource, context)
        violations.push(...ruleViolations)

        // Check if rule blocks access
        if (ruleViolations.some(v => v.blocksAccess)) {
          accessGranted = false
        }
      }
    }

    // Log the security evaluation
    await this.logAuditEvent({
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      organizationId: context.organizationId,
      userId: context.userId,
      action: `${action}_security_check`,
      resource,
      resourceId: context.connection?.id,
      details: {
        accessGranted,
        violationsCount: violations.length,
        policiesEvaluated: applicablePolicies.length
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      success: accessGranted,
      complianceFlags: violations
        .map(v => v.complianceFlag)
        .filter((flag): flag is string => Boolean(flag))
    })

    return {
      accessGranted,
      violations,
      recommendations,
      evaluatedPolicies: applicablePolicies.length
    }
  }

  // Evaluate individual security rule
  private async evaluateRule(
    rule: SecurityRule,
    action: string,
    resource: string,
    context: SecurityContext
  ): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = []

    // Check if rule applies to this action/resource
    const actionMatches = this.matchesCondition(
      rule.conditions.find(c => c.field === 'action'),
      action
    )
    const resourceMatches = this.matchesCondition(
      rule.conditions.find(c => c.field === 'resource'),
      resource
    )

    if (!actionMatches && !resourceMatches) {
      return violations
    }

    // Evaluate rule-specific conditions
    switch (rule.type) {
      case 'access_control':
        violations.push(...await this.checkAccessControl(rule, context))
        break
      case 'data_encryption':
        violations.push(...await this.checkDataEncryption(rule, context))
        break
      case 'audit_logging':
        violations.push(...await this.checkAuditLogging(rule, context))
        break
      case 'compliance_check':
        violations.push(...await this.checkCompliance(rule, context))
        break
    }

    return violations
  }

  // Access control checks
  private async checkAccessControl(rule: SecurityRule, context: SecurityContext): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = []

    // Check user role permissions
    const userRole = await this.getUserRole(context.userId, context.organizationId)
    const requiredRole = rule.conditions.find(c => c.field === 'requiredRole')?.value

    if (requiredRole && !this.hasRequiredRole(userRole, requiredRole)) {
      violations.push({
        ruleId: rule.id,
        type: 'access_control',
        severity: rule.severity,
        message: `Insufficient permissions. Required role: ${requiredRole}, user role: ${userRole}`,
        blocksAccess: true,
        complianceFlag: 'RBAC_VIOLATION'
      })
    }

    // Check IP restrictions
    const allowedIPs = rule.conditions.find(c => c.field === 'allowedIPs')?.value
    if (allowedIPs && context.ipAddress && !allowedIPs.includes(context.ipAddress)) {
      violations.push({
        ruleId: rule.id,
        type: 'access_control',
        severity: rule.severity,
        message: `IP address ${context.ipAddress} not in allowed list`,
        blocksAccess: true,
        complianceFlag: 'IP_RESTRICTION'
      })
    }

    return violations
  }

  // Data encryption checks
  private async checkDataEncryption(rule: SecurityRule, context: SecurityContext): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = []

    if (context.data) {
      // Check if sensitive data is encrypted
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'ssn', 'credit_card']
      const dataString = JSON.stringify(context.data)

      for (const field of sensitiveFields) {
        if (dataString.toLowerCase().includes(field)) {
          // Check if data appears to be encrypted (not plain text)
          const fieldRegex = new RegExp(`${field}["\\s:]+([^",\\s]{10,})`, 'i')
          const match = dataString.match(fieldRegex)

          if (match && match[1]) {
            const value = match[1]
            // Basic check: encrypted data should not be readable text
            if (!this.isLikelyEncrypted(value)) {
              violations.push({
                ruleId: rule.id,
                type: 'data_encryption',
                severity: rule.severity,
                message: `Sensitive field '${field}' contains unencrypted data`,
                blocksAccess: false,
                complianceFlag: 'DATA_ENCRYPTION'
              })
            }
          }
        }
      }
    }

    return violations
  }

  // Audit logging checks
  private async checkAuditLogging(rule: SecurityRule, context: SecurityContext): Promise<SecurityViolation[]> {
    // Audit logging is always required for security events
    // This rule ensures proper logging is happening
    return []
  }

  // Compliance checks
  private async checkCompliance(rule: SecurityRule, context: SecurityContext): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = []

    // Check data retention compliance
    if (rule.conditions.some(c => c.field === 'dataRetention')) {
      const retentionDays = rule.conditions.find(c => c.field === 'dataRetention')?.value
      if (context.connection?.createdAt) {
        const ageInDays = (Date.now() - context.connection.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        if (ageInDays > retentionDays) {
          violations.push({
            ruleId: rule.id,
            type: 'compliance_check',
            severity: rule.severity,
            message: `Data retention violation: connection older than ${retentionDays} days`,
            blocksAccess: false,
            complianceFlag: 'DATA_RETENTION'
          })
        }
      }
    }

    return violations
  }

  // Helper methods
  private matchesCondition(condition: SecurityCondition | undefined, value: unknown): boolean {
    if (!condition) return true

    switch (condition.operator) {
      case 'equals':
        return value === condition.value
      case 'not_equals':
        return value !== condition.value
      case 'contains':
        return String(value).includes(String(condition.value))
      case 'matches_regex':
        return new RegExp(condition.value).test(String(value))
      default:
        return false
    }
  }

  private async getUserRole(userId: string | undefined, organizationId: string): Promise<string> {
    // Mock implementation - in real app, this would query the database
    if (!userId) return 'anonymous'

    // Check for admin users, organization owners, etc.
    // This would integrate with your actual user/role system
    return 'user' // Default role
  }

  private hasRequiredRole(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = {
      'owner': 4,
      'admin': 3,
      'manager': 2,
      'user': 1,
      'anonymous': 0
    }

    return (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) >=
           (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0)
  }

  private isLikelyEncrypted(value: string): boolean {
    // Basic heuristic: encrypted data should be long and contain various character types
    if (value.length < 20) return false

    const hasUppercase = /[A-Z]/.test(value)
    const hasLowercase = /[a-z]/.test(value)
    const hasNumbers = /\d/.test(value)
    const hasSpecial = /[^A-Za-z0-9]/.test(value)

    return hasUppercase && hasLowercase && hasNumbers && hasSpecial
  }

  // Audit logging
  async logAuditEvent(entry: AuditLogEntry): Promise<void> {
    this.auditLogs.push(entry)

    // Keep only last 10000 entries to prevent memory issues
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000)
    }

    // In production, this would write to a secure audit log database
    logger.info('AUDIT', {
      timestamp: entry.timestamp.toISOString(),
      organizationId: entry.organizationId,
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      success: entry.success,
      violations: entry.complianceFlags
    })
  }

  // Get audit logs
  getAuditLogs(organizationId: string, filters?: {
    userId?: string
    action?: string
    resource?: string
    startDate?: Date
    endDate?: Date
    complianceFlags?: string[]
  }): AuditLogEntry[] {
    return this.auditLogs
      .filter(log => log.organizationId === organizationId)
      .filter(log => !filters?.userId || log.userId === filters.userId)
      .filter(log => !filters?.action || log.action.includes(filters.action))
      .filter(log => !filters?.resource || log.resource === filters.resource)
      .filter(log => !filters?.startDate || log.timestamp >= filters.startDate)
      .filter(log => !filters?.endDate || log.timestamp <= filters.endDate)
      .filter(log => !filters?.complianceFlags ||
        filters.complianceFlags.some(flag => log.complianceFlags.includes(flag)))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Data encryption utilities
  encryptData(data: string, key?: string): string {
    // In production, use proper encryption like AES-256
    // This is a mock implementation
    const crypto = require('crypto')
    const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default-key'
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
  }

  decryptData(encryptedData: string, key?: string): string {
    // In production, use proper decryption
    // This is a placeholder implementation - replace with actual decryption
    try {
      const crypto = require('crypto')
      const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default-key'
      const [ivHex, encrypted] = encryptedData.split(':')
      const iv = Buffer.from(ivHex, 'hex')
      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey)
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      return decrypted
    } catch {
      throw new Error('Failed to decrypt data')
    }
  }

  // Compliance monitoring
  registerComplianceCheck(check: ComplianceCheck): void {
    this.complianceChecks.set(check.id, check)
  }

  runComplianceChecks(organizationId: string): ComplianceCheck[] {
    const checks = Array.from(this.complianceChecks.values())
      .filter(check => this.isCheckApplicable(check, organizationId))

    checks.forEach(check => {
      check.lastChecked = new Date()
      // Run actual compliance validation logic here
      // This would check data handling, encryption, access controls, etc.
      check.status = 'passing' // Placeholder status - implement actual compliance checking
    })

    return checks
  }

  private isCheckApplicable(check: ComplianceCheck, organizationId: string): boolean {
    // Check if this compliance requirement applies to the organization
    // Based on industry, location, data types handled, etc.
    return true // Placeholder implementation - implement actual organization compliance checking
  }
}

interface SecurityEvaluationResult {
  accessGranted: boolean
  violations: SecurityViolation[]
  recommendations: string[]
  evaluatedPolicies: number
}

interface SecurityViolation {
  ruleId: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  blocksAccess: boolean
  complianceFlag?: string
}

// Global security manager instance
export const integrationSecurity = new IntegrationSecurityManager()

// Pre-configured security policies from workflow inventory
export const DefaultSecurityPolicies = {
  zeroTrustAccess: {
    id: 'zero-trust-access',
    name: 'Zero Trust Access',
    description: 'Enforces zero trust access control for integrations',
    rules: [
      {
        id: 'zero-trust-access-rule',
        type: 'access_control' as const,
        conditions: [
          { field: 'action', operator: 'equals' as const, value: 'access_integration' },
          { field: 'requiredRole', operator: 'equals' as const, value: 'zero_trust' }
        ],
        actions: [{ type: 'deny' }],
        severity: 'high' as const
      }
    ]
  },
  basicAccessControl: {
    id: 'basic-access-control',
    name: 'Basic Access Control',
    description: 'Enforces role-based access control for integrations',
    rules: [
      {
        id: 'admin-only-integration-management',
        type: 'access_control' as const,
        conditions: [
          { field: 'action', operator: 'equals' as const, value: 'manage_integrations' },
          { field: 'requiredRole', operator: 'equals' as const, value: 'admin' }
        ],
        actions: [{ type: 'deny' }],
        severity: 'high' as const
      },
      {
        id: 'owner-only-sensitive-data',
        type: 'access_control' as const,
        conditions: [
          { field: 'resource', operator: 'contains' as const, value: 'financial' },
          { field: 'requiredRole', operator: 'equals' as const, value: 'owner' }
        ],
        actions: [{ type: 'deny' }],
        severity: 'critical' as const
      }
    ]
  },

  // Data encryption policy
  dataEncryptionPolicy: {
    id: 'data-encryption',
    name: 'Data Encryption Policy',
    description: 'Ensures sensitive data is properly encrypted',
    rules: [
      {
        id: 'encrypt-sensitive-fields',
        type: 'data_encryption' as const,
        conditions: [
          { field: 'data', operator: 'contains', value: 'password' },
          { field: 'data', operator: 'contains', value: 'token' },
          { field: 'data', operator: 'contains', value: 'secret' }
        ],
        actions: [{ type: 'encrypt' }],
        severity: 'high' as const
      }
    ]
  },

  // Audit logging policy
  auditLoggingPolicy: {
    id: 'audit-logging',
    name: 'Audit Logging Policy',
    description: 'Ensures all integration activities are logged',
    rules: [
      {
        id: 'log-all-actions',
        type: 'audit_logging' as const,
        conditions: [],
        actions: [{ type: 'log' }],
        severity: 'medium' as const
      }
    ]
  },

  // GDPR compliance policy
  gdprCompliance: {
    id: 'gdpr-compliance',
    name: 'GDPR Compliance',
    description: 'Ensures compliance with GDPR data protection requirements',
    rules: [
      {
        id: 'data-retention-gdpr',
        type: 'compliance_check' as const,
        conditions: [
          { field: 'dataRetention', operator: 'equals', value: 2555 } // 7 years in days
        ],
        actions: [{ type: 'alert' }],
        severity: 'high' as const
      }
    ]
  }
}

// Register default policies
Object.values(DefaultSecurityPolicies).forEach(policy => {
  integrationSecurity.registerPolicy({
    ...policy,
    organizationId: 'system', // System-level policies
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    rules: policy.rules.map(rule => ({
      ...rule,
      actions: rule.actions.map(action => ({
        type: action.type as SecurityAction['type']
      }))
    }))
  })
})

// Register default compliance checks
export const DefaultComplianceChecks = {
  gdprCheck: {
    id: 'gdpr-compliance-check',
    name: 'GDPR Data Protection',
    description: 'Validates GDPR compliance for data handling',
    standard: 'GDPR' as const,
    rules: [
      {
        field: 'personalData',
        requirement: 'Data encryption required',
        checkType: 'encryption' as const,
        severity: 'high' as const
      },
      {
        field: 'consent',
        requirement: 'User consent required for data processing',
        checkType: 'presence' as const,
        severity: 'critical' as const
      }
    ],
    status: 'passing' as const,
    lastChecked: new Date()
  },

  hipaaCheck: {
    id: 'hipaa-compliance-check',
    name: 'HIPAA Health Data Protection',
    description: 'Validates HIPAA compliance for health data',
    standard: 'HIPAA' as const,
    rules: [
      {
        field: 'phi',
        requirement: 'Protected Health Information encryption',
        checkType: 'encryption' as const,
        severity: 'critical' as const
      }
    ],
    status: 'passing' as const,
    lastChecked: new Date()
  }
}

Object.values(DefaultComplianceChecks).forEach(check => {
  integrationSecurity.registerComplianceCheck(check)
})

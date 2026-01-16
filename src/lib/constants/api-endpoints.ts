/**
 * API Endpoints Constants
 *
 * Centralized configuration for all API endpoints used throughout the application.
 * Eliminates hardcoded URLs and ensures consistent endpoint management.
 */

import { EXTERNAL_SERVICES } from './external-services'

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY: '/api/auth/verify'
  },

  // User Management
  USERS: '/api/users',
  PROFILE: '/api/profile',

  // Organizations
  ORGANIZATIONS: {
    BASE: '/api/organizations',
    SETTINGS: '/api/v1/organizations/settings',
    MEMBERS: '/api/organizations/members'
  },

  // Integrations
  INTEGRATIONS: '/api/integrations',

  // Reports & Analytics
  REPORTS: '/api/reports',
  ANALYTICS: '/api/analytics',

  // Calendar & Events
  CALENDAR: '/api/calendar',
  EVENTS: '/api/events',

  // Finance APIs
  STRIPE: EXTERNAL_SERVICES.STRIPE.baseUrl,
  QUICKBOOKS: EXTERNAL_SERVICES.QUICKBOOKS.baseUrl,
  XERO: EXTERNAL_SERVICES.XERO.baseUrl,

  // External Services
  GOOGLE_CALENDAR: EXTERNAL_SERVICES.GOOGLE_CALENDAR.baseUrl,
  SLACK_WEBHOOK: '/api/webhooks/slack',

  // File Storage Providers
  GOOGLE_DRIVE: 'https://www.googleapis.com/drive/v3',
  DROPBOX_API: 'https://api.dropboxapi.com/2',
  DROPBOX_CONTENT: 'https://content.dropboxapi.com/2',
  ONEDRIVE: 'https://graph.microsoft.com/v1.0',
  SHAREPOINT: 'https://graph.microsoft.com/v1.0',
  BOX: 'https://api.box.com/2.0',
  ICLOUD: 'https://api.icloud.com/1',
  MEGA: 'https://g.api.mega.co.nz',
  PCLOUD: 'https://api.pcloud.com',

  // Communication Providers
  SLACK: 'https://slack.com/api',
  DISCORD: 'https://discord.com/api/v10',
  TEAMS: 'https://graph.microsoft.com/v1.0',

  // Project Management
  JIRA: 'https://api.atlassian.com/ex/jira',
  TRELLO: 'https://api.trello.com/1',
  ASANA: 'https://app.asana.com/api/1.0',

  // Analytics
  GOOGLE_ANALYTICS: 'https://www.googleapis.com/analytics/v4',
  MIXPANEL: 'https://api.mixpanel.com',
  AMPLITUDE: 'https://api.amplitude.com',

  // Learning
  COURSERA: 'https://api.coursera.org/api',
  UDEMY: 'https://www.udemy.com/api-2.0',

  // POS
  SQUARE: 'https://connect.squareup.com/v2',

  // Time Tracking
  TOGGL: 'https://api.track.toggl.com/api/v9',
  HARVEST: 'https://api.harvestapp.com/v2',

  // Version Control
  GITHUB: 'https://api.github.com',
  GITLAB: 'https://gitlab.com/api/v4',
  BITBUCKET: 'https://api.bitbucket.org/2.0',

  // CI/CD
  GITHUB_ACTIONS: 'https://api.github.com/repos',
  JENKINS: 'https://your-jenkins-instance.com/api',
  CIRCLECI: 'https://circleci.com/api/v2',

  // Documentation
  CONFLUENCE: 'https://api.atlassian.com/ex/confluence',
  NOTION: 'https://api.notion.com/v1',

  // HR Management
  BAMBOOHR: 'https://api.bamboohr.com/api/gateway.php',
  GREENHOUSE: 'https://harvest.greenhouse.io/v1',

  // Inventory
  SHIPBOB: 'https://api.shipbob.com/1.0',
  SHIPSTATION: 'https://ssapi.shipstation.com',

  // Legal
  DOCUSIGN: 'https://demo.docusign.net/restapi/v2.1',
  DOCUSIGN_AUTH: 'https://account-d.docusign.com/oauth/token',
  HELLO_SIGN: 'https://api.hellosign.com/v3',

  // Marketing
  MAILCHIMP: 'https://api.mailchimp.com/3.0',
  HUBSPOT: 'https://api.hubapi.com',

  // Payroll
  ADP: 'https://api.adp.com',
  PAYCHEX: 'https://api.paychex.com',
} as const

export type ApiEndpoint = typeof API_ENDPOINTS

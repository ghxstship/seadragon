
import { NextResponse } from 'next/server'

// GET /api/docs - OpenAPI/Swagger documentation
export async function GET() {
  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'ATLVS + GVTEWAY Super App API',
      description: 'Comprehensive API for live entertainment management, event planning, and audience engagement',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'api@atlvs.com',
        url: 'https://atlvs.com/support'
      },
      license: {
        name: 'Proprietary',
        url: 'https://atlvs.com/terms'
      }
    },
    servers: [
      {
        url: 'https://api.atlvs.com/v1',
        description: 'Production server'
      },
      {
        url: 'https://staging-api.atlvs.com/v1',
        description: 'Staging server'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    security: [
      {
        bearerAuth: []
      },
      {
        apiKeyAuth: []
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string', enum: ['guest', 'member', 'team', 'admin', 'platform_dev'] },
            organizationId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'email', 'role']
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            venue: { type: 'string' },
            capacity: { type: 'integer' },
            status: { type: 'string', enum: ['draft', 'planning', 'published', 'cancelled'] },
            category: { type: 'string' },
            ticketPrice: { type: 'number' },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'name', 'date', 'status']
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'object' }
          },
          required: ['error']
        }
      }
    },
    paths: {
      '/auth/login': {
        post: {
          summary: 'User login',
          description: 'Authenticate user with email and password',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                    organizationSlug: { type: 'string' }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      token: { type: 'string' }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/auth/signup': {
        post: {
          summary: 'User registration',
          description: 'Register a new user account',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                    organizationName: { type: 'string' },
                    organizationSlug: { type: 'string' }
                  },
                  required: ['firstName', 'lastName', 'email', 'password']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Invalid input data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/events': {
        get: {
          summary: 'List events',
          description: 'Get a list of events with optional filtering',
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string', enum: ['draft', 'planning', 'published', 'cancelled'] }
            },
            {
              name: 'category',
              in: 'query',
              schema: { type: 'string' }
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
            },
            {
              name: 'offset',
              in: 'query',
              schema: { type: 'integer', minimum: 0, default: 0 }
            }
          ],
          responses: {
            '200': {
              description: 'List of events',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      events: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Event' }
                      },
                      total: { type: 'integer' },
                      limit: { type: 'integer' },
                      offset: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create event',
          description: 'Create a new event',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    venue: { type: 'string' },
                    capacity: { type: 'integer' },
                    category: { type: 'string' },
                    ticketPrice: { type: 'number' }
                  },
                  required: ['name', 'date']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Event created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            }
          }
        }
      },
      '/events/{eventId}': {
        get: {
          summary: 'Get event',
          description: 'Get details of a specific event',
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'Event details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            },
            '404': {
              description: 'Event not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        put: {
          summary: 'Update event',
          description: 'Update an existing event',
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    venue: { type: 'string' },
                    capacity: { type: 'integer' },
                    category: { type: 'string' },
                    ticketPrice: { type: 'number' },
                    status: { type: 'string', enum: ['draft', 'planning', 'published', 'cancelled'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Event updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Event' }
                }
              }
            }
          }
        },
        delete: {
          summary: 'Delete event',
          description: 'Delete an event',
          parameters: [
            {
              name: 'eventId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '204': {
              description: 'Event deleted successfully'
            }
          }
        }
      },
      '/webhooks': {
        get: {
          summary: 'List webhooks',
          description: 'Get a list of registered webhooks',
          responses: {
            '200': {
              description: 'List of webhooks',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      webhooks: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            url: { type: 'string', format: 'uri' },
                            events: { type: 'array', items: { type: 'string' } },
                            isActive: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create webhook',
          description: 'Register a new webhook endpoint',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', format: 'uri' },
                    events: { type: 'array', items: { type: 'string' } },
                    description: { type: 'string' }
                  },
                  required: ['url', 'events']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Webhook created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      url: { type: 'string', format: 'uri' },
                      events: { type: 'array', items: { type: 'string' } },
                      secret: { type: 'string' },
                      isActive: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/integrations': {
        get: {
          summary: 'List integrations',
          description: 'Get a list of available integrations and their providers',
          parameters: [
            {
              name: 'category',
              in: 'query',
              schema: {
                type: 'string',
                enum: [
                  'project_management', 'version_control', 'ci_cd', 'documentation',
                  'time_tracking', 'file_storage', 'hr', 'payroll', 'pos', 'ticketing',
                  'inventory', 'analytics', 'design', 'testing', 'monitoring',
                  'security', 'learning', 'marketing', 'legal', 'finance'
                ]
              }
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
            }
          ],
          responses: {
            '200': {
              description: 'List of integrations',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      integrations: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            name: { type: 'string' },
                            provider: { type: 'string' },
                            category: { type: 'string' },
                            description: { type: 'string' },
                            websiteUrl: { type: 'string', format: 'uri' },
                            apiDocsUrl: { type: 'string', format: 'uri' },
                            supportedFeatures: { type: 'array', items: { type: 'string' } },
                            isActive: { type: 'boolean' }
                          }
                        }
                      },
                      total: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create integration',
          description: 'Set up a new integration with a third-party service',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    providerId: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    configuration: { type: 'object' },
                    settings: { type: 'object' },
                    isSandbox: { type: 'boolean', default: false }
                  },
                  required: ['providerId', 'name']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Integration created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      provider: { type: 'string' },
                      status: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/integrations/{integrationId}': {
        get: {
          summary: 'Get integration details',
          description: 'Get detailed information about a specific integration',
          parameters: [
            {
              name: 'integrationId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '200': {
              description: 'Integration details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      provider: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          type: { type: 'string' },
                          supportedFeatures: { type: 'array', items: { type: 'string' } }
                        }
                      },
                      status: { type: 'string' },
                      lastSyncAt: { type: 'string', format: 'date-time' },
                      syncStatus: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        },
        put: {
          summary: 'Update integration',
          description: 'Update integration settings and configuration',
          parameters: [
            {
              name: 'integrationId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    settings: { type: 'object' },
                    isActive: { type: 'boolean' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Integration updated successfully'
            }
          }
        },
        delete: {
          summary: 'Delete integration',
          description: 'Remove an integration and all associated data',
          parameters: [
            {
              name: 'integrationId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          responses: {
            '204': {
              description: 'Integration deleted successfully'
            }
          }
        }
      },
      '/integrations/{integrationId}/sync': {
        post: {
          summary: 'Trigger integration sync',
          description: 'Manually trigger synchronization with the integrated service',
          parameters: [
            {
              name: 'integrationId',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' }
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    syncType: {
                      type: 'string',
                      enum: ['full', 'incremental', 'webhook'],
                      default: 'incremental'
                    },
                    force: { type: 'boolean', default: false }
                  }
                }
              }
            }
          },
          responses: {
            '202': {
              description: 'Sync initiated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      syncId: { type: 'string', format: 'uuid' },
                      status: { type: 'string' },
                      estimatedCompletion: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/integrations/sync-status': {
        get: {
          summary: 'Get sync status',
          description: 'Get the status of recent integration synchronization operations',
          parameters: [
            {
              name: 'integrationId',
              in: 'query',
              schema: { type: 'string', format: 'uuid' }
            },
            {
              name: 'status',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['started', 'success', 'failed', 'partial']
              }
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', minimum: 1, maximum: 50, default: 20 }
            }
          ],
          responses: {
            '200': {
              description: 'Sync status information',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      syncs: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', format: 'uuid' },
                            integrationId: { type: 'string', format: 'uuid' },
                            integrationName: { type: 'string' },
                            syncType: { type: 'string' },
                            status: { type: 'string' },
                            recordsProcessed: { type: 'integer' },
                            recordsCreated: { type: 'integer' },
                            recordsUpdated: { type: 'integer' },
                            recordsFailed: { type: 'integer' },
                            startedAt: { type: 'string', format: 'date-time' },
                            completedAt: { type: 'string', format: 'date-time' },
                            errorMessage: { type: 'string' }
                          }
                        }
                      },
                      total: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Events',
        description: 'Event management and operations'
      },
      {
        name: 'Webhooks',
        description: 'Real-time webhook integrations'
      },
      {
        name: 'AI',
        description: 'AI-powered assistance and recommendations'
      },
      {
        name: 'Integrations',
        description: 'Third-party service integrations for project lifecycle management'
      }
    ]
  }

  return NextResponse.json(openApiSpec)
}

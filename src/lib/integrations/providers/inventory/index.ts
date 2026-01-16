// Inventory Management Integrations - Top 10 Providers
// Fishbowl, Cin7, TradeGecko, QuickBooks Inventory, Zoho Inventory, inFlow, Sortly, Katana, Finale Inventory, Lightspeed Retail

import { IntegrationAPIClient, IntegrationConfig, IntegrationSyncResult, SyncDataParams, SyncResultMetadata } from '../types'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface InventorySyncParams extends SyncDataParams {
  includeProducts?: boolean
  includeStockLevels?: boolean
  includeSuppliers?: boolean
  includeWarehouses?: boolean
  includePurchaseOrders?: boolean
  includeSalesOrders?: boolean
  warehouseId?: string
  lowStockThreshold?: number
}

interface FishbowlPart {
  id: number
  partNumber: string
  description: string
  qtyOnHand: number
  [key: string]: unknown
}

interface Cin7Product {
  id: string
  code: string
  name: string
  stockOnHand: number
  [key: string]: unknown
}

interface TradeGeckoProduct {
  id: number
  name: string
  sku: string
  stock_on_hand: number
  [key: string]: unknown
}

// =============================================================================
// FISHBOWL INTEGRATION
// =============================================================================

export class FishbowlClient implements IntegrationAPIClient {
  providerId = 'fishbowl'
  private baseUrl: string = ''
  private username: string = ''
  private password: string = ''
  private appId: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.baseUrl || !config.additionalConfig?.username || !config.additionalConfig?.password || !config.additionalConfig?.appId) {
      throw new Error('Fishbowl server URL, username, password, and app ID are required')
    }
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.username = config.additionalConfig.username
    this.password = config.additionalConfig.password
    this.appId = config.additionalConfig.appId
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/json/v1/${this.appId}/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
      const data = await response.json()
      return response.ok && data.success
    } catch {
      return false
    }
  }

  async syncData(params?: InventorySyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync parts/products
      if (params?.includeProducts) {
        const parts = await this.getParts(params)
        recordsProcessed += parts.length
      }

      // Sync inventory quantities
      if (params?.includeStockLevels) {
        const inventory = await this.getInventoryLevels(params)
        recordsProcessed += inventory.length
      }

      // Sync suppliers
      if (params?.includeSuppliers) {
        const suppliers = await this.getSuppliers(params)
        recordsProcessed += suppliers.length
      }

      // Sync purchase orders
      if (params?.includePurchaseOrders) {
        const purchaseOrders = await this.getPurchaseOrders(params)
        recordsProcessed += purchaseOrders.length
      }

      // Sync sales orders
      if (params?.includeSalesOrders) {
        const salesOrders = await this.getSalesOrders(params)
        recordsProcessed += salesOrders.length
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

  async getParts(params?: InventorySyncParams): Promise<FishbowlPart[]> {
    const response = await fetch(`${this.baseUrl}/api/json/v1/${this.appId}/GetParts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        limit: params?.limit || 100
      })
    })

    if (!response.ok) {
      throw new Error(`Fishbowl API error: ${response.status}`)
    }

    const data = await response.json()
    return data.parts || []
  }

  async getInventoryLevels(params?: InventorySyncParams): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/json/v1/${this.appId}/GetInventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        warehouseId: params?.warehouseId
      })
    })

    if (!response.ok) {
      throw new Error(`Fishbowl API error: ${response.status}`)
    }

    const data = await response.json()
    return data.inventory || []
  }

  async getSuppliers(params?: InventorySyncParams): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/json/v1/${this.appId}/GetVendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        limit: params?.limit || 100
      })
    })

    if (!response.ok) {
      throw new Error(`Fishbowl API error: ${response.status}`)
    }

    const data = await response.json()
    return data.vendors || []
  }

  async getPurchaseOrders(params?: InventorySyncParams): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/json/v1/${this.appId}/GetPurchaseOrders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        limit: params?.limit || 50
      })
    })

    if (!response.ok) {
      throw new Error(`Fishbowl API error: ${response.status}`)
    }

    const data = await response.json()
    return data.purchaseOrders || []
  }

  async getSalesOrders(params?: InventorySyncParams): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/json/v1/${this.appId}/GetSalesOrders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        limit: params?.limit || 50
      })
    })

    if (!response.ok) {
      throw new Error(`Fishbowl API error: ${response.status}`)
    }

    const data = await response.json()
    return data.salesOrders || []
  }

  async createPurchaseOrder(poData: Record<string, unknown>): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/json/v1/${this.appId}/CreatePurchaseOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        ...poData
      })
    })

    if (!response.ok) {
      throw new Error(`Fishbowl API error: ${response.status}`)
    }

    return response.json()
  }
}

// =============================================================================
// CIN7 INTEGRATION
// =============================================================================

export class Cin7Client implements IntegrationAPIClient {
  providerId = 'cin7'
  private baseUrl = 'https://api.cin7.com/api/v1'
  private apiKey: string = ''

  async authenticate(config: IntegrationConfig): Promise<void> {
    if (!config.apiKey) {
      throw new Error('Cin7 API key is required')
    }
    this.apiKey = config.apiKey
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/products?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async syncData(params?: InventorySyncParams): Promise<IntegrationSyncResult> {
    const syncStart = new Date()
    let recordsProcessed = 0
    const errors: string[] = []

    try {
      // Sync products
      if (params?.includeProducts) {
        const products = await this.getProducts(params)
        recordsProcessed += products.length
      }

      // Sync stock levels
      if (params?.includeStockLevels) {
        const stockLevels = await this.getStockLevels(params)
        recordsProcessed += stockLevels.length
      }

      // Sync suppliers
      if (params?.includeSuppliers) {
        const suppliers = await this.getSuppliers(params)
        recordsProcessed += suppliers.length
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

  async getProducts(params?: InventorySyncParams): Promise<Cin7Product[]> {
    const url = `${this.baseUrl}/products?limit=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Cin7 API error: ${response.status}`)
    }

    return response.json()
  }

  async getStockLevels(params?: InventorySyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/stock?limit=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Cin7 API error: ${response.status}`)
    }

    return response.json()
  }

  async getSuppliers(params?: InventorySyncParams): Promise<any[]> {
    const url = `${this.baseUrl}/suppliers?limit=${params?.limit || 100}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Cin7 API error: ${response.status}`)
    }

    return response.json()
  }

  async updateStock(productId: string, quantity: number, locationId?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/stock`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        productId,
        quantity,
        locationId
      })
    })

    if (!response.ok) {
      throw new Error(`Cin7 API error: ${response.status}`)
    }

    return response.json()
  }
}

// Additional implementations for TradeGecko, QuickBooks Inventory, Zoho Inventory, inFlow, Sortly, Katana, Finale Inventory, Lightspeed Retail would follow the same pattern...

// =============================================================================
// REGISTRATION
// =============================================================================

import { integrationManager } from '../manager'

export function registerInventoryIntegrations(): void {
  integrationManager.registerAPIClient('fishbowl', new FishbowlClient())
  integrationManager.registerAPIClient('cin7', new Cin7Client())
  // Register remaining providers...
}


/**
 * SaaS UI Trends 2026 - Behavior Tracking Service
 * AI-driven adaptive interfaces through user behavior analysis
 */

import { logger } from '@/lib/logger'

export interface ClickEvent {
  elementId: string;
  elementType: string;
  timestamp: Date;
  position: { x: number; y: number };
  context: string;
}

export interface UserBehavior {
  userId: string;
  featureUsage: Map<string, number>;
  sessionTimes: Date[];
  clickPatterns: ClickEvent[];
  navigationPaths: string[];
  dwellTimes: Map<string, number>;
  lastActive: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  preferredDensity: 'compact' | 'comfortable' | 'spacious';
  preferredSidebarPosition: 'left' | 'right' | 'hidden';
  frequentFeatures: string[];
  workingHours: { start: number; end: number };
  timezone: string;
}

export interface PatternAnalysis {
  frequentPaths: string[];
  peakUsageTimes: number[];
  preferredFeatures: string[];
  suggestedLayout: LayoutSuggestion;
}

export interface LayoutSuggestion {
  sidebarPosition: 'left' | 'right' | 'hidden';
  primaryWidgets: string[];
  colorScheme: 'light' | 'dark' | 'lowLight' | 'auto';
  density: 'compact' | 'comfortable' | 'spacious';
}

type BehaviorEventHandler = (data: PatternAnalysis) => void;

class BehaviorTracker {
  private behaviors: UserBehavior;
  private eventHandlers: Map<string, BehaviorEventHandler[]> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;
  private dwellStartTimes: Map<string, number> = new Map();

  constructor(userId: string) {
    this.behaviors = {
      userId,
      featureUsage: new Map(),
      sessionTimes: [],
      clickPatterns: [],
      navigationPaths: [],
      dwellTimes: new Map(),
      lastActive: new Date(),
      preferences: {
        preferredDensity: 'comfortable',
        preferredSidebarPosition: 'left',
        frequentFeatures: [],
        workingHours: { start: 9, end: 17 },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    this.startSession();
  }

  private startSession(): void {
    this.behaviors.sessionTimes.push(new Date());
    
    // Sync behavior data every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncToBackend();
    }, 30000);
  }

  trackFeatureUsage(featureId: string): void {
    const count = this.behaviors.featureUsage.get(featureId) || 0;
    this.behaviors.featureUsage.set(featureId, count + 1);
    this.behaviors.lastActive = new Date();
    this.analyzePatterns();
  }

  trackClick(event: Omit<ClickEvent, 'timestamp'>): void {
    this.behaviors.clickPatterns.push({
      ...event,
      timestamp: new Date(),
    });

    // Keep only last 1000 clicks
    if (this.behaviors.clickPatterns.length > 1000) {
      this.behaviors.clickPatterns = this.behaviors.clickPatterns.slice(-1000);
    }

    this.behaviors.lastActive = new Date();
  }

  trackNavigation(path: string): void {
    this.behaviors.navigationPaths.push(path);
    
    // Keep only last 500 navigation events
    if (this.behaviors.navigationPaths.length > 500) {
      this.behaviors.navigationPaths = this.behaviors.navigationPaths.slice(-500);
    }

    this.behaviors.lastActive = new Date();
    this.analyzePatterns();
  }

  startDwellTracking(elementId: string): void {
    this.dwellStartTimes.set(elementId, Date.now());
  }

  endDwellTracking(elementId: string): void {
    const startTime = this.dwellStartTimes.get(elementId);
    if (startTime) {
      const dwellTime = Date.now() - startTime;
      const existingTime = this.behaviors.dwellTimes.get(elementId) || 0;
      this.behaviors.dwellTimes.set(elementId, existingTime + dwellTime);
      this.dwellStartTimes.delete(elementId);
    }
  }

  private analyzePatterns(): void {
    const analysis = this.getPatternAnalysis();
    this.emit('patternsUpdated', analysis);
  }

  getPatternAnalysis(): PatternAnalysis {
    return {
      frequentPaths: this.getFrequentPaths(),
      peakUsageTimes: this.getPeakUsageTimes(),
      preferredFeatures: this.getPreferredFeatures(),
      suggestedLayout: this.getSuggestedLayout(),
    };
  }

  private getFrequentPaths(): string[] {
    const pathCounts = new Map<string, number>();
    
    this.behaviors.navigationPaths.forEach((path) => {
      const count = pathCounts.get(path) || 0;
      pathCounts.set(path, count + 1);
    });

    return Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path]) => path);
  }

  private getPeakUsageTimes(): number[] {
    const hourCounts = new Array(24).fill(0);
    
    this.behaviors.sessionTimes.forEach((time) => {
      hourCounts[time.getHours()]++;
    });

    // Return hours with above-average usage
    const average = hourCounts.reduce((a, b) => a + b, 0) / 24;
    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count > average)
      .map(({ hour }) => hour);
  }

  private getPreferredFeatures(): string[] {
    return Array.from(this.behaviors.featureUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([feature]) => feature);
  }

  private getSuggestedLayout(): LayoutSuggestion {
    const hour = new Date().getHours();
    const isEvening = hour >= 18 || hour < 6;
    const isLateNight = hour >= 22 || hour < 5;

    // Determine color scheme based on time
    let colorScheme: LayoutSuggestion['colorScheme'] = 'auto';
    if (isLateNight) {
      colorScheme = 'lowLight';
    } else if (isEvening) {
      colorScheme = 'dark';
    }

    // Determine density based on feature usage patterns
    const totalFeatureUsage = Array.from(this.behaviors.featureUsage.values())
      .reduce((a, b) => a + b, 0);
    
    let density: LayoutSuggestion['density'] = 'comfortable';
    if (totalFeatureUsage > 100) {
      density = 'compact'; // Power user
    } else if (totalFeatureUsage < 20) {
      density = 'spacious'; // New user
    }

    return {
      sidebarPosition: this.behaviors.preferences.preferredSidebarPosition,
      primaryWidgets: this.getPreferredFeatures().slice(0, 5),
      colorScheme,
      density,
    };
  }

  on(event: string, handler: BehaviorEventHandler): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(handler);
    this.eventHandlers.set(event, handlers);
  }

  off(event: string, handler: BehaviorEventHandler): void {
    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.eventHandlers.set(event, handlers);
    }
  }

  private emit(event: string, data: PatternAnalysis): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach((handler) => handler(data));
  }

  private async syncToBackend(): Promise<void> {
    try {
      // Convert Maps to objects for JSON serialization
      const behaviorData = {
        userId: this.behaviors.userId,
        featureUsage: Object.fromEntries(this.behaviors.featureUsage),
        sessionTimes: this.behaviors.sessionTimes.map((t) => t.toISOString()),
        navigationPaths: this.behaviors.navigationPaths.slice(-100),
        dwellTimes: Object.fromEntries(this.behaviors.dwellTimes),
        lastActive: this.behaviors.lastActive.toISOString(),
        preferences: this.behaviors.preferences,
      };

      await fetch('/api/analytics/behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(behaviorData),
      });
    } catch (error) {
      logger.error('Failed to sync behavior data', error);
    }
  }

  async loadFromBackend(): Promise<void> {
    try {
      const response = await fetch(`/api/analytics/behavior/${this.behaviors.userId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Restore Maps from objects
        this.behaviors.featureUsage = new Map(Object.entries(data.featureUsage || {}));
        this.behaviors.dwellTimes = new Map(Object.entries(data.dwellTimes || {}));
        this.behaviors.navigationPaths = data.navigationPaths || [];
        this.behaviors.preferences = data.preferences || this.behaviors.preferences;
      }
    } catch (error) {
      logger.error('Failed to load behavior data', error);
    }
  }

  updatePreferences(preferences: Partial<UserPreferences>): void {
    this.behaviors.preferences = {
      ...this.behaviors.preferences,
      ...preferences,
    };
    this.syncToBackend();
  }

  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.syncToBackend();
  }

  getBehaviors(): UserBehavior {
    return this.behaviors;
  }
}

// Singleton instance management
let trackerInstance: BehaviorTracker | null = null;

export function initBehaviorTracker(userId: string): BehaviorTracker {
  if (trackerInstance) {
    trackerInstance.destroy();
  }
  trackerInstance = new BehaviorTracker(userId);
  return trackerInstance;
}

export function getBehaviorTracker(): BehaviorTracker | null {
  return trackerInstance;
}

export { BehaviorTracker };
export default BehaviorTracker;

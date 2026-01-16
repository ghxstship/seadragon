
/**
 * SaaS UI Trends 2026 - Predictive/Proactive UX System
 * AI-driven suggestions that anticipate user actions
 */

import { logger } from '@/lib/logger'

export interface PredictedAction {
  id: string;
  action: string;
  description?: string;
  confidence: number;
  context: string;
  icon?: string;
  trigger: () => void | Promise<void>;
}

export interface AppContext {
  currentPath: string;
  userRole: string;
  recentActions: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
  sessionDuration: number;
  lastActivity?: string;
}

export interface UserPattern {
  action: string;
  frequency: number;
  timePreference?: number[];
  dayPreference?: number[];
}

type PredictionRule = {
  condition: (context: AppContext) => boolean;
  action: Omit<PredictedAction, 'trigger'>;
  triggerFn: () => void;
};

const predictionRules: PredictionRule[] = [
  // Monday morning - weekly reports
  {
    condition: (ctx) => ctx.dayOfWeek === 1 && ctx.timeOfDay === 'morning',
    action: {
      id: 'weekly-report',
      action: 'View Weekly Report',
      description: 'Start your week with a summary',
      confidence: 0.85,
      context: 'Monday morning routine',
      icon: 'chart',
    },
    triggerFn: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/reports/weekly';
      }
    },
  },

  // End of day - status update
  {
    condition: (ctx) => ctx.timeOfDay === 'evening',
    action: {
      id: 'status-update',
      action: "Update Today's Progress",
      description: 'Log your accomplishments',
      confidence: 0.75,
      context: 'End of day wrap-up',
      icon: 'check',
    },
    triggerFn: () => {
      logger.debug('Open status update modal');
    },
  },

  // Friday - weekly review
  {
    condition: (ctx) => ctx.dayOfWeek === 5 && ctx.timeOfDay === 'afternoon',
    action: {
      id: 'weekly-review',
      action: 'Complete Weekly Review',
      description: 'Review your week before the weekend',
      confidence: 0.8,
      context: 'Friday wrap-up',
      icon: 'clipboard',
    },
    triggerFn: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/review';
      }
    },
  },

  // Dashboard - suggest creating task
  {
    condition: (ctx) => ctx.currentPath === '/' || ctx.currentPath === '/dashboard',
    action: {
      id: 'create-task',
      action: 'Create New Task',
      description: 'Add something to your list',
      confidence: 0.7,
      context: 'Dashboard quick action',
      icon: 'plus',
    },
    triggerFn: () => {
      logger.debug('Open create task modal');
    },
  },

  // Long session - suggest break
  {
    condition: (ctx) => ctx.sessionDuration > 90,
    action: {
      id: 'take-break',
      action: 'Take a Break',
      description: "You've been working for a while",
      confidence: 0.65,
      context: 'Wellness reminder',
      icon: 'coffee',
    },
    triggerFn: () => {
      logger.debug('Show break reminder');
    },
  },

  // Settings page - suggest profile update
  {
    condition: (ctx) => ctx.currentPath.includes('/settings'),
    action: {
      id: 'update-profile',
      action: 'Complete Your Profile',
      description: 'Add more details to your profile',
      confidence: 0.6,
      context: 'Profile completion',
      icon: 'user',
    },
    triggerFn: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/settings/profile';
      }
    },
  },
];

export class PredictiveEngine {
  private userPatterns: UserPattern[] = [];
  private dismissedSuggestions: Set<string> = new Set();

  constructor(patterns?: UserPattern[]) {
    this.userPatterns = patterns || [];
  }

  async predictNextActions(context: AppContext): Promise<PredictedAction[]> {
    const predictions: PredictedAction[] = [];

    // Apply rule-based predictions
    for (const rule of predictionRules) {
      if (rule.condition(context) && !this.dismissedSuggestions.has(rule.action.id)) {
        predictions.push({
          ...rule.action,
          trigger: rule.triggerFn,
        });
      }
    }

    // Apply pattern-based predictions
    const patternPredictions = this.getPatternBasedPredictions(context);
    predictions.push(...patternPredictions);

    // Sort by confidence and return top 3
    return predictions
      .filter((p) => p.confidence > 0.5)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }

  private getPatternBasedPredictions(context: AppContext): PredictedAction[] {
    const predictions: PredictedAction[] = [];
    const currentHour = new Date().getHours();

    for (const pattern of this.userPatterns) {
      // Check if this action is typically performed at this time
      if (pattern.timePreference?.includes(currentHour)) {
        const confidence = Math.min(0.9, 0.5 + pattern.frequency * 0.1);
        
        if (!this.dismissedSuggestions.has(pattern.action)) {
          predictions.push({
            id: `pattern-${pattern.action}`,
            action: pattern.action,
            confidence,
            context: 'Based on your habits',
            trigger: () => logger.debug(`Execute: ${pattern.action}`),
          });
        }
      }
    }

    return predictions;
  }

  dismissSuggestion(id: string): void {
    this.dismissedSuggestions.add(id);
  }

  clearDismissed(): void {
    this.dismissedSuggestions.clear();
  }

  updatePatterns(patterns: UserPattern[]): void {
    this.userPatterns = patterns;
  }
}

/**
 * Get current app context
 */
export function getCurrentContext(): AppContext {
  const now = new Date();
  const hour = now.getHours();

  let timeOfDay: AppContext['timeOfDay'];
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  return {
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
    userRole: 'user',
    recentActions: [],
    timeOfDay,
    dayOfWeek: now.getDay(),
    sessionDuration: 0,
  };
}

export default PredictiveEngine;

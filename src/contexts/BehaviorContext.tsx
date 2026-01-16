
'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  BehaviorTracker, 
  initBehaviorTracker, 
  getBehaviorTracker,
  PatternAnalysis,
  LayoutSuggestion,
  UserPreferences,
} from '@/services/behaviorTracking';

interface BehaviorContextValue {
  tracker: BehaviorTracker | null;
  patterns: PatternAnalysis | null;
  suggestedLayout: LayoutSuggestion | null;
  userPatterns: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  userRole: string;
  trackFeature: (featureId: string) => void;
  trackNavigation: (path: string) => void;
  trackClick: (elementId: string, elementType: string, context: string) => void;
  startDwellTracking: (elementId: string) => void;
  endDwellTracking: (elementId: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  isInitialized: boolean;
}

const BehaviorContext = createContext<BehaviorContextValue | undefined>(undefined);

interface BehaviorProviderProps {
  children: React.ReactNode;
  userId?: string;
  userRole?: string;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function BehaviorProvider({
  children,
  userId,
  userRole = 'user',
}: BehaviorProviderProps) {
  const [tracker, setTracker] = useState<BehaviorTracker | null>(null);
  const [patterns, setPatterns] = useState<PatternAnalysis | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  // Initialize tracker when userId is available
  useEffect(() => {
    if (!userId) return;

    const newTracker = initBehaviorTracker(userId);
    setTracker(newTracker);

    // Load existing behavior data
    newTracker.loadFromBackend().then(() => {
      setPatterns(newTracker.getPatternAnalysis());
      setIsInitialized(true);
    });

    // Listen for pattern updates
    const handlePatternsUpdated = (analysis: PatternAnalysis) => {
      setPatterns(analysis);
    };

    newTracker.on('patternsUpdated', handlePatternsUpdated);

    return () => {
      newTracker.off('patternsUpdated', handlePatternsUpdated);
      newTracker.destroy();
    };
  }, [userId]);

  // Update time of day periodically
  useEffect(() => {
    setTimeOfDay(getTimeOfDay());
    
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Track navigation on route changes
  useEffect(() => {
    if (!tracker || typeof window === 'undefined') return;

    const handleRouteChange = () => {
      tracker.trackNavigation(window.location.pathname);
    };

    // Track initial page
    handleRouteChange();

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [tracker]);

  const trackFeature = useCallback((featureId: string) => {
    tracker?.trackFeatureUsage(featureId);
  }, [tracker]);

  const trackNavigation = useCallback((path: string) => {
    tracker?.trackNavigation(path);
  }, [tracker]);

  const trackClick = useCallback((
    elementId: string,
    elementType: string,
    context: string
  ) => {
    tracker?.trackClick({
      elementId,
      elementType,
      context,
      position: { x: 0, y: 0 }, // Will be updated by actual click handler
    });
  }, [tracker]);

  const startDwellTracking = useCallback((elementId: string) => {
    tracker?.startDwellTracking(elementId);
  }, [tracker]);

  const endDwellTracking = useCallback((elementId: string) => {
    tracker?.endDwellTracking(elementId);
  }, [tracker]);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    tracker?.updatePreferences(preferences);
  }, [tracker]);

  const suggestedLayout = useMemo(() => {
    return patterns?.suggestedLayout || null;
  }, [patterns]);

  const userPatterns = useMemo(() => {
    return patterns?.frequentPaths || [];
  }, [patterns]);

  const value: BehaviorContextValue = {
    tracker,
    patterns,
    suggestedLayout,
    userPatterns,
    timeOfDay,
    userRole,
    trackFeature,
    trackNavigation,
    trackClick,
    startDwellTracking,
    endDwellTracking,
    updatePreferences,
    isInitialized,
  };

  return (
    <BehaviorContext.Provider value={value}>
      {children}
    </BehaviorContext.Provider>
  );
}

export function useBehaviorContext() {
  const context = useContext(BehaviorContext);
  if (context === undefined) {
    throw new Error('useBehaviorContext must be used within a BehaviorProvider');
  }
  return context;
}

export function useFeatureTracking(featureId: string) {
  const { trackFeature, startDwellTracking, endDwellTracking } = useBehaviorContext();

  useEffect(() => {
    trackFeature(featureId);
    startDwellTracking(featureId);

    return () => {
      endDwellTracking(featureId);
    };
  }, [featureId, trackFeature, startDwellTracking, endDwellTracking]);
}

export { BehaviorContext };

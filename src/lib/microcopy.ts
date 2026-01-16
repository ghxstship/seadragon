
/**
 * SaaS UI Trends 2026 - Emotion-Driven Microcopy System
 * Encouraging, contextual copy that creates emotional connection
 */

export interface MicrocopyConfig {
  context: string;
  variations: string[];
  tone: 'encouraging' | 'playful' | 'professional' | 'warm';
}

export const microcopy: Record<string, MicrocopyConfig> = {
  emptyState: {
    context: 'empty-list',
    tone: 'encouraging',
    variations: [
      "Nothing here yet—let's change that!",
      "Ready when you are. Add your first item!",
      "This space is waiting for your first creation.",
      "A blank canvas full of possibilities.",
    ],
  },

  emptySearch: {
    context: 'no-search-results',
    tone: 'warm',
    variations: [
      "No matches found. Try different keywords?",
      "We couldn't find that. Maybe try another search?",
      "Nothing here matches your search. Let's try again!",
    ],
  },

  taskComplete: {
    context: 'task-completed',
    tone: 'playful',
    variations: [
      "Nailed it! ",
      "One down, you're on a roll!",
      "Check! You're making great progress.",
      "Done and dusted! ",
      "Another one bites the dust!",
      "You're crushing it!",
    ],
  },

  allTasksComplete: {
    context: 'all-tasks-done',
    tone: 'playful',
    variations: [
      "All done! Time for a victory lap ",
      "Inbox zero achieved! You're a productivity ninja.",
      "Everything's complete. Treat yourself!",
      "You've conquered your to-do list!",
    ],
  },

  loading: {
    context: 'loading-state',
    tone: 'warm',
    variations: [
      "Brewing something good...",
      "Just a moment...",
      "Getting everything ready for you...",
      "Loading the magic...",
      "Almost there...",
      "Fetching your data...",
    ],
  },

  saving: {
    context: 'saving-state',
    tone: 'professional',
    variations: [
      "Saving your changes...",
      "Updating...",
      "Almost saved...",
      "Syncing your work...",
    ],
  },

  saved: {
    context: 'saved-state',
    tone: 'professional',
    variations: [
      "All changes saved",
      "Saved successfully",
      "Your work is safe",
      "Changes synced",
    ],
  },

  error: {
    context: 'error-state',
    tone: 'professional',
    variations: [
      "Hmm, that didn't work. Let's try again.",
      "Something went wrong on our end. We're on it!",
      "Oops! We hit a snag. Please try once more.",
      "That didn't go as planned. Mind trying again?",
    ],
  },

  networkError: {
    context: 'network-error',
    tone: 'professional',
    variations: [
      "Looks like you're offline. We'll sync when you're back.",
      "Connection lost. Your changes are saved locally.",
      "No internet? No problem. We'll catch up later.",
    ],
  },

  welcomeBack: {
    context: 'user-return',
    tone: 'warm',
    variations: [
      "Welcome back! Ready to pick up where you left off?",
      "Good to see you again!",
      "You're back! Let's do this.",
      "Hey there! Ready for another productive session?",
    ],
  },

  firstVisit: {
    context: 'new-user',
    tone: 'encouraging',
    variations: [
      "Welcome! Let's get you started.",
      "Great to have you here! Let's explore together.",
      "Welcome aboard! Your journey starts now.",
    ],
  },

  formValidation: {
    context: 'form-error',
    tone: 'professional',
    variations: [
      "Please check the highlighted fields",
      "A few things need your attention",
      "Almost there! Just a few fixes needed",
    ],
  },

  deleteConfirm: {
    context: 'delete-confirmation',
    tone: 'professional',
    variations: [
      "Are you sure? This can't be undone.",
      "This will be permanently deleted.",
      "Once deleted, this cannot be recovered.",
    ],
  },

  uploadSuccess: {
    context: 'upload-complete',
    tone: 'playful',
    variations: [
      "Upload complete! ",
      "Your file is ready to go!",
      "Successfully uploaded!",
    ],
  },

  milestone: {
    context: 'achievement',
    tone: 'playful',
    variations: [
      "Milestone reached! ",
      "You've hit a new milestone!",
      "Achievement unlocked!",
      "Look at you go! Another milestone down.",
    ],
  },
};

/**
 * Get a random microcopy variation for a given key
 */
export function getRandomMicrocopy(key: string): string {
  const config = microcopy[key];
  if (!config) return '';

  const randomIndex = Math.floor(Math.random() * config.variations.length);
  return config.variations[randomIndex];
}

/**
 * Get all variations for a key
 */
export function getMicrocopyVariations(key: string): string[] {
  return microcopy[key]?.variations || [];
}

/**
 * Get time-aware greeting
 */
export function getGreeting(userName?: string): string {
  const hour = new Date().getHours();
  const name = userName ? `, ${userName}` : '';

  if (hour >= 5 && hour < 12) {
    return `Good morning${name}! ️`;
  } else if (hour >= 12 && hour < 17) {
    return `Good afternoon${name}!`;
  } else if (hour >= 17 && hour < 21) {
    return `Good evening${name}!`;
  } else {
    return `Burning the midnight oil${name}? `;
  }
}

/**
 * Get day-aware message
 */
export function getDayMessage(): string {
  const day = new Date().getDay();
  const messages: Record<number, string> = {
    0: "Happy Sunday! Taking it easy today?",
    1: "Happy Monday! Let's start the week strong.",
    2: "Tuesday vibes. You've got this!",
    3: "Midweek momentum! Keep going.",
    4: "Thursday already! The weekend is in sight.",
    5: "TGIF! Let's finish the week strong.",
    6: "Saturday mode activated. Enjoy!",
  };
  return messages[day] || "Have a great day!";
}

/**
 * Get encouraging message based on completion percentage
 */
export function getProgressMessage(percentage: number): string {
  if (percentage === 0) {
    return "Ready to get started?";
  } else if (percentage < 25) {
    return "Great start! Keep going.";
  } else if (percentage < 50) {
    return "You're making progress!";
  } else if (percentage < 75) {
    return "More than halfway there!";
  } else if (percentage < 100) {
    return "Almost done! You've got this.";
  } else {
    return "All done! Amazing work! ";
  }
}

/**
 * Get streak message
 */
export function getStreakMessage(days: number): string {
  if (days === 0) {
    return "Start your streak today!";
  } else if (days === 1) {
    return "Day 1! The journey begins.";
  } else if (days < 7) {
    return `${days} day streak! Keep it up!`;
  } else if (days < 30) {
    return `${days} days strong! `;
  } else if (days < 100) {
    return `${days} day streak! You're unstoppable!`;
  } else {
    return `${days} days! Legendary status! `;
  }
}

export default microcopy;

// Utility functions for localStorage management

export const STORAGE_KEYS = {
  ATTEMPTS: "comptia-attempts",
  DOMAINS_PASSED: "comptia-domains-passed",
  SESSION: "comptia-session",
  USER: "user-storage",
} as const;

export const clearAllAppData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing app data:", error);
  }
};

export const clearExpiredSessions = () => {
  try {
    const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const sessionAge = Date.now() - (sessionData.sessionStartTime || 0);

      // Clear sessions older than 24 hours
      if (sessionAge >= 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        return true; // Session was expired and cleared
      }
    }
    return false; // No expired session found
  } catch (error) {
    console.error("Error clearing expired sessions:", error);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return true; // Cleared due to error
  }
};

export const getStorageData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorageData = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

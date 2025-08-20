import { useState, useEffect } from "react";

// Types for localStorage-based test results
interface LocalTestResult {
  id: string;
  user_id: string;
  domain_id: number;
  score: number;
  total_questions: number;
  duration: number;
  passed: boolean;
  completed_at: string;
  attempt_number: number;
}

interface LocalDomainProgress {
  user_id: string;
  domain_id: number;
  best_score: number;
  total_attempts: number;
  last_attempt_date: string;
  is_passed: boolean;
}

interface LocalUserStats {
  totalTests: number;
  totalPassed: number;
  averageScore: number;
  domainsCompleted: number;
}

// LocalStorage keys
const STORAGE_KEYS = {
  TEST_RESULTS: "comptia-test-results",
  DOMAIN_PROGRESS: "comptia-domain-progress",
  USER_STATS: "comptia-user-stats",
} as const;

// Helper functions for localStorage operations
const getLocalStorageData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

const setLocalStorageData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

// Hook for saving test results to localStorage
export const useSaveLocalTestResult = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTestResult = async (testResult: Omit<LocalTestResult, "id" | "attempt_number">) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get existing test results
      const existingResults = getLocalStorageData<LocalTestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
      
      // Calculate attempt number for this domain
      const domainAttempts = existingResults.filter(
        result => result.user_id === testResult.user_id && result.domain_id === testResult.domain_id
      );
      
      const testResultWithAttempt: LocalTestResult = {
        ...testResult,
        id: `${testResult.user_id}-${testResult.domain_id}-${Date.now()}`,
        attempt_number: domainAttempts.length + 1,
      };

      // Add new result
      const updatedResults = [...existingResults, testResultWithAttempt];
      setLocalStorageData(STORAGE_KEYS.TEST_RESULTS, updatedResults);

      // Update domain progress
      await updateDomainProgress({
        user_id: testResult.user_id,
        domain_id: testResult.domain_id,
        best_score: testResult.score,
        total_attempts: domainAttempts.length + 1,
        last_attempt_date: testResult.completed_at,
        is_passed: testResult.passed,
      });

      return testResultWithAttempt;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save test result";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveTestResult,
    isLoading,
    error,
  };
};

// Hook for fetching user test results from localStorage
export const useLocalUserTestResults = (userId: string, enabled = true) => {
  const [data, setData] = useState<LocalTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !userId) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allResults = getLocalStorageData<LocalTestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
      const userResults = allResults
        .filter(result => result.user_id === userId)
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
      
      setData(userResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch test results";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, enabled]);

  const refetch = () => {
    if (enabled && userId) {
      setIsLoading(true);
      try {
        const allResults = getLocalStorageData<LocalTestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
        const userResults = allResults
          .filter(result => result.user_id === userId)
          .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
        
        setData(userResults);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch test results";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

// Hook for fetching user domain progress from localStorage
export const useLocalUserDomainProgress = (userId: string, enabled = true) => {
  const [data, setData] = useState<LocalDomainProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !userId) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allProgress = getLocalStorageData<LocalDomainProgress[]>(STORAGE_KEYS.DOMAIN_PROGRESS, []);
      const userProgress = allProgress
        .filter(progress => progress.user_id === userId)
        .sort((a, b) => a.domain_id - b.domain_id);
      
      setData(userProgress);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch domain progress";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, enabled]);

  const refetch = () => {
    if (enabled && userId) {
      setIsLoading(true);
      try {
        const allProgress = getLocalStorageData<LocalDomainProgress[]>(STORAGE_KEYS.DOMAIN_PROGRESS, []);
        const userProgress = allProgress
          .filter(progress => progress.user_id === userId)
          .sort((a, b) => a.domain_id - b.domain_id);
        
        setData(userProgress);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch domain progress";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

// Hook for fetching user stats from localStorage
export const useLocalUserStats = (userId: string, enabled = true) => {
  const [data, setData] = useState<LocalUserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !userId) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const allResults = getLocalStorageData<LocalTestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
      const allProgress = getLocalStorageData<LocalDomainProgress[]>(STORAGE_KEYS.DOMAIN_PROGRESS, []);
      
      const userResults = allResults.filter(result => result.user_id === userId);
      const userProgress = allProgress.filter(progress => progress.user_id === userId);

      const totalTests = userResults.length;
      const totalPassed = userResults.filter(result => result.passed).length;
      const averageScore = totalTests > 0
        ? Math.round(
            userResults.reduce((sum, result) => sum + (result.score / result.total_questions), 0) / totalTests * 100
          )
        : 0;
      const domainsCompleted = userProgress.filter(progress => progress.is_passed).length;

      setData({
        totalTests,
        totalPassed,
        averageScore,
        domainsCompleted,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user stats";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, enabled]);

  const refetch = () => {
    if (enabled && userId) {
      setIsLoading(true);
      try {
        const allResults = getLocalStorageData<LocalTestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
        const allProgress = getLocalStorageData<LocalDomainProgress[]>(STORAGE_KEYS.DOMAIN_PROGRESS, []);
        
        const userResults = allResults.filter(result => result.user_id === userId);
        const userProgress = allProgress.filter(progress => progress.user_id === userId);

        const totalTests = userResults.length;
        const totalPassed = userResults.filter(result => result.passed).length;
        const averageScore = totalTests > 0
          ? Math.round(
              userResults.reduce((sum, result) => sum + (result.score / result.total_questions), 0) / totalTests * 100
            )
          : 0;
        const domainsCompleted = userProgress.filter(progress => progress.is_passed).length;

        setData({
          totalTests,
          totalPassed,
          averageScore,
          domainsCompleted,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch user stats";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

// Helper function to update domain progress
const updateDomainProgress = async (progress: LocalDomainProgress): Promise<void> => {
  try {
    const allProgress = getLocalStorageData<LocalDomainProgress[]>(STORAGE_KEYS.DOMAIN_PROGRESS, []);
    
    // Find existing progress for this user and domain
    const existingIndex = allProgress.findIndex(
      p => p.user_id === progress.user_id && p.domain_id === progress.domain_id
    );

    if (existingIndex >= 0) {
      // Update existing progress
      const existing = allProgress[existingIndex];
      allProgress[existingIndex] = {
        ...existing,
        best_score: Math.max(existing.best_score, progress.best_score),
        total_attempts: progress.total_attempts,
        last_attempt_date: progress.last_attempt_date,
        is_passed: progress.is_passed,
      };
    } else {
      // Add new progress
      allProgress.push(progress);
    }

    setLocalStorageData(STORAGE_KEYS.DOMAIN_PROGRESS, allProgress);
  } catch (error) {
    console.error("Error updating domain progress:", error);
    throw error;
  }
};

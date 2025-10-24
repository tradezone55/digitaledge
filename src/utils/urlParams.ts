import { getStorageData, setStorageData, STORAGE_KEYS } from './localStorage';

/**
 * URL Query Parameter utilities with localStorage fallback
 * This provides a seamless way to manage application state through URL parameters
 * while maintaining localStorage as a fallback for offline scenarios
 */

export interface QuizState {
  domain?: number;
  question?: number;
  score?: number;
  sessionActive?: boolean;
  sessionComplete?: boolean;
  showResults?: boolean;
  timeElapsed?: number;
}

export interface URLState {
  quiz?: QuizState;
  [key: string]: any;
}

/**
 * Parse URL query parameters into a state object
 */
export const parseURLParams = (): URLState => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const state: URLState = {};
  
  // Parse quiz-specific parameters
  const domain = params.get('domain');
  const question = params.get('question');
  const score = params.get('score');
  const sessionActive = params.get('sessionActive');
  const sessionComplete = params.get('sessionComplete');
  const showResults = params.get('showResults');
  const timeElapsed = params.get('timeElapsed');
  
  if (domain || question || score || sessionActive || sessionComplete || showResults || timeElapsed) {
    state.quiz = {
      ...(domain && { domain: parseInt(domain, 10) }),
      ...(question && { question: parseInt(question, 10) }),
      ...(score && { score: parseInt(score, 10) }),
      ...(sessionActive && { sessionActive: sessionActive === 'true' }),
      ...(sessionComplete && { sessionComplete: sessionComplete === 'true' }),
      ...(showResults && { showResults: showResults === 'true' }),
      ...(timeElapsed && { timeElapsed: parseInt(timeElapsed, 10) }),
    };
  }
  
  return state;
};

/**
 * Update URL query parameters with new state
 */
export const updateURLParams = (state: URLState, replaceHistory = false): void => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  // Update quiz parameters
  if (state.quiz) {
    Object.entries(state.quiz).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
  }
  
  // Update other parameters
  Object.entries(state).forEach(([key, value]) => {
    if (key !== 'quiz' && value !== undefined && value !== null) {
      params.set(key, value.toString());
    }
  });
  
  // Update URL
  url.search = params.toString();
  
  if (replaceHistory) {
    window.history.replaceState({}, '', url.toString());
  } else {
    window.history.pushState({}, '', url.toString());
  }
};

/**
 * Get state from URL parameters with localStorage fallback
 */
export const getStateWithFallback = <T>(key: string, defaultValue: T): T => {
  // First try to get from URL parameters
  const urlState = parseURLParams();
  
  if (key === 'quiz' && urlState.quiz) {
    return urlState.quiz as T;
  }
  
  if (urlState[key] !== undefined) {
    return urlState[key] as T;
  }
  
  // Fallback to localStorage
  return getStorageData(key, defaultValue);
};

/**
 * Set state to both URL parameters and localStorage
 */
export const setStateWithPersistence = (
  key: string, 
  value: any, 
  updateURL = true,
  replaceHistory = false
): void => {
  // Save to localStorage as fallback
  setStorageData(key, value);
  
  // Update URL parameters if requested
  if (updateURL) {
    const urlState: URLState = {};
    
    if (key === 'quiz') {
      urlState.quiz = value;
    } else {
      urlState[key] = value;
    }
    
    updateURLParams(urlState, replaceHistory);
  }
};

/**
 * Clear URL parameters for a specific key
 */
export const clearURLParam = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  params.delete(key);
  url.search = params.toString();
  window.history.replaceState({}, '', url.toString());
};

/**
 * Clear all URL parameters
 */
export const clearAllURLParams = (): void => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());
};

/**
 * Restore state from URL parameters on page load
 */
export const restoreStateFromURL = (): QuizState => {
  const urlState = parseURLParams();
  return urlState.quiz || {};
};

/**
 * Hook for managing quiz state with URL persistence
 */
export const useQuizStateManager = () => {
  const getQuizState = (): QuizState => {
    return getStateWithFallback('quiz', {});
  };
  
  const setQuizState = (state: Partial<QuizState>, replaceHistory = false): void => {
    const currentState = getQuizState();
    const newState = { ...currentState, ...state };
    
    setStateWithPersistence('quiz', newState, true, replaceHistory);
  };
  
  const clearQuizState = (): void => {
    clearURLParam('domain');
    clearURLParam('question');
    clearURLParam('score');
    clearURLParam('sessionActive');
    clearURLParam('sessionComplete');
    clearURLParam('showResults');
    clearURLParam('timeElapsed');
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };
  
  return {
    getQuizState,
    setQuizState,
    clearQuizState,
  };
};

/**
 * Utility to sync localStorage with URL parameters
 * Useful for restoring state when URL parameters are present
 */
export const syncStateWithURL = (): void => {
  const urlState = parseURLParams();
  
  if (urlState.quiz) {
    setStorageData('quiz-state', urlState.quiz);
  }
};

/**
 * Check if URL contains quiz parameters
 */
export const hasQuizParams = (): boolean => {
  const urlState = parseURLParams();
  return urlState.quiz !== undefined;
};

/**
 * Get current domain from URL or localStorage
 */
export const getCurrentDomain = (): number => {
  const quizState = getStateWithFallback<QuizState>('quiz', {});
  return quizState.domain || 1;
};

/**
 * Set current domain in URL and localStorage
 */
export const setCurrentDomain = (domain: number): void => {
  setQuizState({ domain });
};

/**
 * Get current question from URL or localStorage
 */
export const getCurrentQuestion = (): number => {
  const quizState = getStateWithFallback<QuizState>('quiz', {});
  return quizState.question || 0;
};

/**
 * Set current question in URL and localStorage
 */
export const setCurrentQuestion = (question: number): void => {
  setQuizState({ question });
};

/**
 * Set quiz state helper function
 */
const setQuizState = (state: Partial<QuizState>, replaceHistory = false): void => {
  const currentState = getStateWithFallback('quiz', {});
  const newState = { ...currentState, ...state };
  
  setStateWithPersistence('quiz', newState, true, replaceHistory);
};

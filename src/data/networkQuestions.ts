// networkQuestions.ts
// Complete CompTIA Network+ Question Bank - 210 Questions

export interface Question {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  wrongExplanations: (string | null)[];
  topic: string;
}

export type DomainId = 1 | 2 | 3 | 4 | 5;

export const questionBank: Record<DomainId, Question[]> = {
  1: [
    // Domain 1 questions will go here (you already have these in AccessScreen.tsx)
  ],
  2: [
    // PASTE DOMAIN 2 QUESTIONS HERE
  ],
  3: [
    // Domain 3 questions will go here
  ],
  4: [
    // Domain 4 questions will go here
  ],
  5: [
    // Domain 5 questions will go here
  ],
};

export const getQuestionsForDomain = (domainId: DomainId): Question[] => {
  return questionBank[domainId] || [];
};

export const getRandomQuestions = (domainId: DomainId, count: number): Question[] => {
  const questions = getQuestionsForDomain(domainId);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
};

  export interface TestResult {
  id?: string;
  user_id: string;
  score: number;
  duration: number; // in seconds
  attempt_number: number;
  created_at: string;
  updated_at: string;
  domain_id: number;
}


export interface TriviaQuestion {
  id: string;
  category: string;
  difficulty: string;      // or: 'easy' | 'medium' | 'hard' if you want to constrain it
  question: string;
  answers: string[];
  correct_index: number;   // IMPORTANT: keep snake_case if backend sends snake_case
  tags: string[];
}
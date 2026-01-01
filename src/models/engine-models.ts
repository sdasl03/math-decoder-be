export type MathTheme = 'algebra' | 'geometry' | 'calculus' | 'statistics';
export type GradingMethod = 'automatic' | 'manual' | 'hybrid';
export interface ActivityConfig {
    theme: MathTheme;
    level: number;
    numberOfExercises: number;
    gradingMethod: GradingMethod;
}
export interface GeneratorContext {
    theme: MathTheme;
    level: number;
    seed: number;
}
export interface MathExercise {
    id: string;
    prompt: string;
    solution: unknown;
    difficulty: number;
    metadata?: {
        topic?: string;
        tags?: string[];
        operands?: number[];
    };
}

export interface MathActivity {
    id: string;
    theme: MathTheme;
    level: number;
    grading: GradingStrategy | null;
    metadata?: {
        createdAt?: Date;
        estimatedDurationMinutes?: number;
    };
    exercises: MathExercise[];
}

export interface MathExerciseGenerator {
    canGenerate(context: GeneratorContext): boolean;
    generate(context: GeneratorContext): MathExercise[];
}
export interface GradingStrategy {
    grade(submission: ExerciseSubmission[]): string;
}
export interface ExerciseSubmission {
    activityId: string;
    studentId: string;
    exerciseId: string;
    answer: unknown;
}
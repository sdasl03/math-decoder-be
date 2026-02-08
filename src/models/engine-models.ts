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
    grading: GradingMethod | null;
    metadata?: {
        gradingMethod?: GradingMethod;
        autoGradableCount?: number;
        exerciseIds?: string[];
        createdAt?: Date;
        estimatedDurationMinutes?: number;
    };
    exercises: MathExercise[];
}

export interface MathExerciseGenerator {
    canGenerate(context: GeneratorContext): boolean;
    generate(context: GeneratorContext): MathExercise[];
}
export interface ExerciseSubmission {
    activityId: string;
    studentId: string;
    exerciseId: string;
    answer: unknown;
}

export interface GradingResult {
    exerciseId: string;
    isCorrect: boolean;
    score: number; // 0-1 scale
    feedback: string;
    expectedSolution?: unknown;
    userAnswer?: unknown;
    metadata?: {
        gradingMethod: GradingMethod;
        gradedAt: Date;
        processingTimeMs: number;
    };
}

export interface GradingContext {
    activityId: string;
    studentId: string;
    submissionTime: Date;
    exercise: MathExercise;
    attemptNumber?: number;
}

export interface StepGradingResult {
    stepId: string;
    isCorrect: boolean;
    score: number;
    feedback: string;
}

export interface GradingStrategy {
    readonly method: GradingMethod;
    
    grade(
        exercise: MathExercise, 
        userAnswer: unknown, 
        context?: Partial<GradingContext>
    ): GradingResult;
    
    canGrade(exercise: MathExercise): boolean;
    supportsPartialCredit(): boolean;
}
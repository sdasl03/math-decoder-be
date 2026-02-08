import { Injectable, Logger } from "@nestjs/common";
import { GradingStrategy, MathExercise, GradingResult } from "src/models/engine-models";
import { ClockService } from "src/utils/clock.service";

// Gradable solution types
const GRADABLE_TYPES = ['number', 'string', 'boolean'];

// Hard-coded feedback messages - consider moving to i18n service
const FEEDBACK_CORRECT = 'Correct!';
const FEEDBACK_INCORRECT = 'Incorrect. Try again!';
const FEEDBACK_GRADING_ERROR = 'Unable to automatically grade this exercise.';

// Numeric comparison tolerance for floating-point numbers
const NUMERIC_COMPARISON_TOLERANCE = 0.0001;

const FEEDBACK_MAP: Record<string, string> = {
    'algebra': 'Check your algebraic manipulation steps.',
    'arithmetic': 'Review your arithmetic operations.',
    'geometry': 'Verify your geometric reasoning.',
    'calculus': 'Double-check your differentiation/integration.'
};

// grading/auto-grading.strategy.ts
@Injectable()
export class AutoGradingStrategy implements GradingStrategy {
    readonly method = 'automatic' as const;
    private readonly logger = new Logger(AutoGradingStrategy.name);
    
    constructor(private readonly clock: ClockService) {}
    
    canGrade(exercise: MathExercise): boolean {
        // Check if solution exists and is of a gradable type
        if (!exercise?.solution) return false;
        
        const solutionType = typeof exercise.solution;
        return GRADABLE_TYPES.includes(solutionType) || 
               (Array.isArray(exercise.solution) && exercise.solution.every(item => 
                   GRADABLE_TYPES.includes(typeof item)
               ));
    }
    
    supportsPartialCredit(): boolean {
        return false; // Pure auto-grading typically doesn't do partial credit
    }
    
    grade(
        exercise: MathExercise, 
        userAnswer: unknown, 
    ): GradingResult {
        const startTime = this.clock.currentTimeMs();
        
        try {
            const isCorrect = this.compareAnswer(exercise.solution, userAnswer);
            const score = isCorrect ? 1 : 0;
            
            return {
                exerciseId: exercise.id,
                isCorrect,
                score,
                feedback: this.generateFeedback(isCorrect, exercise),
                expectedSolution: exercise.solution,
                userAnswer,
                metadata: {
                    gradingMethod: this.method,
                    gradedAt: this.clock.now(),
                    processingTimeMs: this.clock.currentTimeMs() - startTime
                }
            };
            
        } catch (error) {
            // Graceful fallback - log and return failed result
            this.logger.error(
                `Auto-grading failed for exercise ${exercise?.id}`,
                error instanceof Error ? error.stack : String(error)
            );
            return {
                exerciseId: exercise?.id || 'unknown',
                isCorrect: false,
                score: 0,
                feedback: FEEDBACK_GRADING_ERROR,
                expectedSolution: exercise?.solution,
                userAnswer,
                metadata: {
                    gradingMethod: this.method,
                    gradedAt: this.clock.now(),
                    processingTimeMs: this.clock.currentTimeMs() - startTime
                }
            };
        }
    }
    
    private compareAnswer(expected: unknown, actual: unknown): boolean {
        // Direct equality for primitives
        if (expected === actual) return true;
        
        // Numeric comparison with tolerance
        if (typeof expected === 'number' && typeof actual === 'number') {
            return Math.abs(expected - actual) < NUMERIC_COMPARISON_TOLERANCE;
        }
        
        // Array comparison
        if (Array.isArray(expected) && Array.isArray(actual)) {
            if (expected.length !== actual.length) return false;
            return expected.every((val, idx) => this.compareAnswer(val, actual[idx]));
        }
        
        // String comparison (case-insensitive for some cases)
        if (typeof expected === 'string' && typeof actual === 'string') {
            return expected.toLowerCase() === actual.toLowerCase();
        }
        
        return false;
    }
    
    private generateFeedback(isCorrect: boolean, exercise: MathExercise): string {
        if (isCorrect) {
            return FEEDBACK_CORRECT;
        }
        
        // Topic-specific feedback based on metadata
        const topic = exercise.metadata?.topic;
        return FEEDBACK_MAP[topic || ''] || FEEDBACK_INCORRECT;
    }
}
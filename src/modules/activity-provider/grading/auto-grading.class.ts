import { Injectable } from "@nestjs/common";
import { GradingStrategy, MathExercise, GradingResult } from "src/models/engine-models";

// grading/auto-grading.strategy.ts
@Injectable()
export class AutoGradingStrategy implements GradingStrategy {
    readonly method = 'automatic' as const;
    
    canGrade(exercise: MathExercise): boolean {
        // Check if solution exists and is of a gradable type
        if (!exercise.solution) return false;
        
        const solutionType = typeof exercise.solution;
        return ['number', 'string', 'boolean'].includes(solutionType) || 
               (Array.isArray(exercise.solution) && exercise.solution.every(item => 
                   typeof item === 'number' || typeof item === 'string'
               ));
    }
    
    supportsPartialCredit(): boolean {
        return false; // Pure auto-grading typically doesn't do partial credit
    }
    
    grade(
        exercise: MathExercise, 
        userAnswer: unknown, 
    ): GradingResult {
        const startTime = Date.now();
        
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
                    gradedAt: new Date(),
                    processingTimeMs: Date.now() - startTime
                }
            };
            
        } catch (error) {
            // Graceful fallback
            console.error(`Auto-grading failed for exercise ${exercise.id}:`, error);
            return {
                exerciseId: exercise.id,
                isCorrect: false,
                score: 0,
                feedback: 'Unable to automatically grade this exercise.',
                expectedSolution: exercise.solution,
                userAnswer,
                metadata: {
                    gradingMethod: this.method,
                    gradedAt: new Date(),
                    processingTimeMs: Date.now() - startTime
                }
            };
        }
    }
    
    private compareAnswer(expected: unknown, actual: unknown): boolean {
        // Direct equality for primitives
        if (expected === actual) return true;
        
        // Numeric comparison with tolerance
        if (typeof expected === 'number' && typeof actual === 'number') {
            return Math.abs(expected - actual) < 0.0001;
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
            return 'Correct!';
        }
        
        // Topic-specific feedback based on metadata
        const topic = exercise.metadata?.topic;
        const feedbackMap: Record<string, string> = {
            'algebra': 'Check your algebraic manipulation steps.',
            'arithmetic': 'Review your arithmetic operations.',
            'geometry': 'Verify your geometric reasoning.',
            'calculus': 'Double-check your differentiation/integration.'
        };
        
        return feedbackMap[topic || ''] || 'Incorrect. Try again!';
    }
}
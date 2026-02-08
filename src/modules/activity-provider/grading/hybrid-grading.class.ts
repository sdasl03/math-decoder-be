import { Injectable } from "@nestjs/common";
import { GradingStrategy, MathExercise, GradingResult } from "src/models/engine-models";
import { AutoGradingStrategy } from "./auto-grading.class";
import { ManualGradingStrategy } from "./manual-grading.class";
import { ClockService } from "src/utils/clock.service";

// Gradable solution types
const GRADABLE_TYPES = ['number', 'string', 'boolean'];
// Hybrid review flag message
const FLAGGED_FOR_REVIEW = 'This has been flagged for manual review.';

@Injectable()
export class HybridGradingStrategy implements GradingStrategy {
    readonly method = 'hybrid' as const;
    
    constructor(
        private readonly autoGrading: AutoGradingStrategy,
        private readonly manualGrading: ManualGradingStrategy,
        private readonly clock: ClockService
    ) {}
    
    canGrade(exercise: MathExercise): boolean {
        return this.autoGrading.canGrade(exercise) || 
               this.manualGrading.canGrade(exercise);
    }
    
    supportsPartialCredit(): boolean {
        return true;
    }
    
    grade(
        exercise: MathExercise, 
        userAnswer: unknown,
    ): GradingResult {
        if (this.autoGrading.canGrade(exercise)) {
            const autoResult = this.autoGrading.grade(exercise, userAnswer);
            
            // If automatic grading is confident, use it
            if (this.shouldAcceptAutoGrade(autoResult, exercise)) {
                return autoResult;
            }
            
            return {
                ...autoResult,
                feedback: `${autoResult.feedback} ${FLAGGED_FOR_REVIEW}`,
                metadata: {
                    gradingMethod: autoResult.metadata?.gradingMethod || this.method,
                    gradedAt: autoResult.metadata?.gradedAt || this.clock.now(),
                    processingTimeMs: autoResult.metadata?.processingTimeMs || 0
                }
            };
        }
        
        // Fall back to manual grading
        return this.manualGrading.grade(exercise, userAnswer);
    }
    
    private shouldAcceptAutoGrade(result: GradingResult, exercise: MathExercise): boolean {
        // High confidence auto-grading for simple types
        const isSimpleType = GRADABLE_TYPES.includes(typeof (exercise?.solution ?? ''));
        
        // For complex answers (arrays, objects), we might want manual review
        const isComplexAnswer = Array.isArray(exercise?.solution) || 
                                (typeof exercise?.solution === 'object' && exercise?.solution !== null);
        
        // Accept auto-grade for simple types when correct
        if (isSimpleType && result.isCorrect) {
            return true;
        }
        
        // For complex answers or incorrect simple answers, prefer manual review
        return !isComplexAnswer;
    }
}
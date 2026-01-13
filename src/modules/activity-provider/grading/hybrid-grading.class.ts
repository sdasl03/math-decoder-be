import { Injectable } from "@nestjs/common";
import { GradingStrategy, MathExercise, GradingResult } from "src/models/engine-models";
import { AutoGradingStrategy } from "./auto-grading.class";
import { ManualGradingStrategy } from "./manual-grading.class";

// grading/hybrid-grading.strategy.ts
@Injectable()
export class HybridGradingStrategy implements GradingStrategy {
    readonly method = 'hybrid' as const;
    
    constructor(
        private readonly autoGrading: AutoGradingStrategy,
        private readonly manualGrading: ManualGradingStrategy
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
        // First, try automatic grading
        if (this.autoGrading.canGrade(exercise)) {
            const autoResult = this.autoGrading.grade(exercise, userAnswer);
            
            // If automatic grading is confident, use it
            if (this.shouldAcceptAutoGrade(autoResult, exercise)) {
                return autoResult;
            }
            
            // Otherwise, mark for manual review but keep auto result for reference
            return {
                ...autoResult,
                feedback: `${autoResult.feedback} This has been flagged for manual review.`,
                //metadata: {
                    ...autoResult.metadata,
                    //autoGradedFirst: true,
                    //requiresManualReview: true
                //}
            };
        }
        
        // Fall back to manual grading
        return this.manualGrading.grade(exercise, userAnswer);
    }
    
    private shouldAcceptAutoGrade(result: GradingResult, exercise: MathExercise): boolean {
        // High confidence auto-grading for simple types
        const simpleTypes = ['number', 'string', 'boolean'];
        const isSimpleType = simpleTypes.includes(typeof exercise.solution);
        
        // For complex answers (arrays, objects), we might want manual review
        const isComplexAnswer = Array.isArray(exercise.solution) || 
                                (typeof exercise.solution === 'object' && exercise.solution !== null);
        
        // Accept auto-grade for simple types when correct
        if (isSimpleType && result.isCorrect) {
            return true;
        }
        
        // For complex answers or incorrect simple answers, prefer manual review
        return !isComplexAnswer;
    }
}
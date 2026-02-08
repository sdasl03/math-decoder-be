import { Injectable } from "@nestjs/common";
import { GradingStrategy, MathExercise, GradingResult } from "src/models/engine-models";
import { ClockService } from "src/utils/clock.service";

@Injectable()
export class ManualGradingStrategy implements GradingStrategy {
    readonly method = 'manual' as const;
    
    constructor(private readonly clock: ClockService) {}
    
    canGrade(exercise: MathExercise): boolean {
        return exercise !== undefined;
    }
    
    supportsPartialCredit(): boolean {
        return true; // Manual grading can give partial credit
    }
    
     grade(
        exercise: MathExercise, 
        userAnswer: unknown, 
    ): GradingResult {
        return {
            exerciseId: exercise.id,
            isCorrect: false, // Unknown until manually reviewed
            score: 0,
            feedback: 'Submitted for manual review. You will receive feedback soon.',
            expectedSolution: exercise.solution,
            userAnswer,
            metadata: {
                gradingMethod: this.method,
                gradedAt: this.clock.now(),
                processingTimeMs: 0
            }
        };
    }
}
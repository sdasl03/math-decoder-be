import { Injectable } from "@nestjs/common";
import { GradingMethod, MathExercise, GradingStrategy } from "src/models/engine-models";
import { AutoGradingStrategy } from "./auto-grading.class";
import { HybridGradingStrategy } from "./hybrid-grading.class";
import { ManualGradingStrategy } from "./manual-grading.class";

@Injectable()
export class GradingStrategySelector {
    constructor(
        private readonly autoGrading: AutoGradingStrategy,
        private readonly manualGrading: ManualGradingStrategy,
        private readonly hybridGrading: HybridGradingStrategy
    ) {}
    
    selectStrategy(
        method: GradingMethod, 
        exercise?: MathExercise
    ): GradingStrategy {
        switch (method) {
            case 'automatic':
                return this.autoGrading;
            case 'manual':
                return this.manualGrading;
            case 'hybrid':
                if (exercise) {
                    return this.selectHybridStrategy(exercise);
                }
                return this.hybridGrading;
            default:
                throw new Error('Unknown grading method');
        }
    }
    
    private selectHybridStrategy(exercise: MathExercise): GradingStrategy {
        // Analyze exercise metadata to decide strategy
        const tags = exercise.metadata?.tags || [];
        const topic = exercise.metadata?.topic;
        
        // Exercises that definitely need manual review
        if (tags.includes('proof') || 
            tags.includes('explanation') || 
            topic === 'proof-writing') {
            return this.manualGrading;
        }
        
        // Simple arithmetic exercises can be auto-graded
        if (topic === 'arithmetic' && 
            exercise.metadata?.operands && 
            exercise.metadata.operands.length <= 3) {
            return this.autoGrading;
        }
        
        // Default to hybrid
        return this.hybridGrading;
    }
}
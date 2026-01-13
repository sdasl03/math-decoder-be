import { Injectable } from "@nestjs/common";
import { MathExercise, ActivityConfig, MathActivity, GeneratorContext, ExerciseSubmission, GradingResult, GradingMethod, GradingContext } from "src/models/engine-models";
import { CompositeExerciseGenerator } from "./generators/composite-generator.class";
import { GradingStrategySelector } from "./grading/grading-selector.class";

@Injectable()
export class MathDecoderActivityProvider {
    private exerciseCache = new Map<string, MathExercise>();
    
    constructor(
        private readonly generator: CompositeExerciseGenerator,
        private readonly strategySelector: GradingStrategySelector,
    ) {}
    
    generateActivity(config: ActivityConfig): MathActivity {
        const ctx: GeneratorContext = {
            theme: config.theme,
            level: config.level,
            seed: Date.now(),
        };
        
        const candidates = this.generator.generate(ctx);
        const exercises = this.selectExercises(candidates, config);
        
        // Cache exercises for quick lookup during grading
        exercises.forEach(ex => this.exerciseCache.set(ex.id, ex));
        
        return this.buildActivity(exercises, config);
    }
    
    gradeSubmission(
        submission: ExerciseSubmission
    ): GradingResult {
        const startTime = Date.now();
        
        // Find the exercise
        const exercise = this.exerciseCache.get(submission.exerciseId);
        if (!exercise) {
            throw new Error(`Exercise not found: ${submission.exerciseId}`);
        }
        
        // Get grading method (could be stored per activity or use default)
        const gradingMethod: GradingMethod = this.determineGradingMethod(exercise);
        
        // Select and apply grading strategy
        const strategy = this.strategySelector.selectStrategy(gradingMethod, exercise);
        
        const context: Partial<GradingContext> = {
            activityId: submission.activityId,
            studentId: submission.studentId,
            submissionTime: new Date(),
            exercise
        };
        
        const result = strategy.grade(exercise, submission.answer, context);
        
        // Log performance
        console.log(`Graded exercise ${exercise.id} in ${Date.now() - startTime}ms`);
        
        return result;
    }
    
    private determineGradingMethod(exercise: MathExercise): GradingMethod {
        // Smart determination based on exercise properties
        
        // If solution is complex (array/object), prefer hybrid
        const isComplexSolution = Array.isArray(exercise.solution) || 
                                 (typeof exercise.solution === 'object' && exercise.solution !== null);
        
        // If exercise has proof/explanation tags, use manual
        const isProofExercise = exercise.metadata?.tags?.includes('proof') || 
                               exercise.metadata?.tags?.includes('explanation');
        
        if (isProofExercise) {
            return 'manual';
        } else if (isComplexSolution) {
            return 'hybrid';
        } else {
            return 'automatic';
        }
    }
    
    private buildActivity(
        exercises: MathExercise[],
        config: ActivityConfig,
    ): MathActivity {
        const orderedExercises = this.orderExercises(exercises);
        
        // Determine appropriate grading method for this activity
        const gradingMethod = this.analyzeGradingNeeds(orderedExercises, config.gradingMethod);
        
        return {
            id: this.uuid(),
            theme: config.theme,
            level: config.level,
            exercises: orderedExercises,
            grading: gradingMethod,
            metadata: {
                createdAt: new Date(),
                gradingMethod: gradingMethod,
                autoGradableCount: this.countAutoGradableExercises(orderedExercises),
                exerciseIds: orderedExercises.map(e => e.id)
            },
        };
    }
    
    private analyzeGradingNeeds(
        exercises: MathExercise[], 
        requestedMethod: GradingMethod
    ): GradingMethod {
        // If specific method requested, use it (unless impossible)
        if (requestedMethod === 'manual') return 'manual';
        
        const canAllBeAutoGraded = exercises.every(ex => 
            this.strategySelector.selectStrategy('automatic', ex).canGrade(ex)
        );
        
        if (requestedMethod === 'automatic' && canAllBeAutoGraded) {
            return 'automatic';
        }
        
        // Default to hybrid for mixed or complex exercises
        return 'hybrid';
    }
    
    private countAutoGradableExercises(exercises: MathExercise[]): number {
        const autoStrategy = this.strategySelector.selectStrategy('automatic');
        return exercises.filter(ex => autoStrategy.canGrade(ex)).length;
    }
    
    // ... rest of your existing methods
    
    private orderExercises(exercises: MathExercise[]): MathExercise[] {
        return [...exercises].sort((a, b) => a.difficulty - b.difficulty);
    }
    
    selectExercises(candidates: MathExercise[], config: ActivityConfig): MathExercise[] {
        const level = config.level;
        return candidates.filter(e => Math.abs(e.difficulty - level) <= 1);
    }
    
    uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
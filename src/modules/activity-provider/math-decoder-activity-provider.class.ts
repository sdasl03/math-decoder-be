import { Injectable, BadRequestException } from "@nestjs/common";
import { MathExercise, ActivityConfig, MathActivity, GeneratorContext, ExerciseSubmission, GradingResult, GradingMethod, GradingContext } from "src/models/engine-models";
import { CompositeExerciseGenerator } from "./generators/composite-generator.class";
import { GradingStrategySelector } from "./grading/grading-selector.class";
import { ClockService } from "src/utils/clock.service";
import { UuidService } from "src/utils/uuid.service";

// Constants for configurable values
const EXERCISE_DIFFICULTY_TOLERANCE = 1;  // Difficulty offset when selecting exercises

@Injectable()
export class MathDecoderActivityProvider {
    private exerciseCache = new Map<string, MathExercise>();
    
    constructor(
        private readonly clock: ClockService,
        private readonly uuid: UuidService,
        private readonly generator: CompositeExerciseGenerator,
        private readonly strategySelector: GradingStrategySelector,
    ) {}
    
    generateActivityId(): string {
        return this.uuid.generate();
    }
    generateActivity(config: ActivityConfig): MathActivity {
        const ctx: GeneratorContext = {
            theme: config.theme,
            level: config.level,
            seed: this.clock.currentTimeMs(),
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
        // Validate input
        if (!submission?.exerciseId) {
            throw new BadRequestException('Exercise ID is required');
        }
        
        const startTime = this.clock.currentTimeMs();
        
        // Find the exercise
        const exercise = this.exerciseCache.get(submission.exerciseId);
        if (!exercise) {
            throw new BadRequestException(`Exercise not found: ${submission.exerciseId}`);
        }
        
        // Get grading method (could be stored per activity or use default)
        const gradingMethod: GradingMethod = this.determineGradingMethod(exercise);
        
        // Select and apply grading strategy
        const strategy = this.strategySelector.selectStrategy(gradingMethod, exercise);
        
        const context: Partial<GradingContext> = {
            activityId: submission.activityId,
            studentId: submission.studentId,
            submissionTime: this.clock.now(),
            exercise
        };
        
        const result = strategy.grade(exercise, submission.answer, context);
        
        return result;
    }
    
    private determineGradingMethod(exercise: MathExercise): GradingMethod {

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
            id: this.generateActivityId(),
            theme: config.theme,
            level: config.level,
            exercises: orderedExercises,
            grading: gradingMethod,
            metadata: {
                createdAt: this.clock.now(),
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
        if (requestedMethod === 'manual') return 'manual';
        
        const canAllBeAutoGraded = exercises.every(ex => 
            this.strategySelector.selectStrategy('automatic', ex).canGrade(ex)
        );
        
        if (requestedMethod === 'automatic' && canAllBeAutoGraded) {
            return 'automatic';
        }
        
        return 'hybrid';
    }
    
    private countAutoGradableExercises(exercises: MathExercise[]): number {
        const autoStrategy = this.strategySelector.selectStrategy('automatic');
        return exercises.filter(ex => autoStrategy.canGrade(ex)).length;
    }
    
    private orderExercises(exercises: MathExercise[]): MathExercise[] {
        return [...exercises].sort((a, b) => a.difficulty - b.difficulty);
    }
    
    selectExercises(candidates: MathExercise[], config: ActivityConfig): MathExercise[] {
        const level = config.level;
        return candidates.filter(e => Math.abs(e.difficulty - level) <= EXERCISE_DIFFICULTY_TOLERANCE);
    }
}
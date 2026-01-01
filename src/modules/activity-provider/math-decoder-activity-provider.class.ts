import { Injectable } from "@nestjs/common/decorators/core";
import { CompositeExerciseGenerator } from "./generators/composite-generator.class";
import { GeneratorContext, GradingMethod, GradingStrategy, MathActivity, MathExercise } from "src/models/engine-models";
import { ActivityConfig } from "src/models/engine-models";

@Injectable()
export class MathDecoderActivityProvider {
    constructor(
        private readonly generator: CompositeExerciseGenerator,
    ) { }

    generateActivity(config: ActivityConfig): MathActivity {
        const ctx: GeneratorContext = {
            theme: config.theme,
            level: config.level,
            seed: Date.now(),
        };

        const candidates = this.generator.generate(ctx);

        //review
        const exercises = this.selectExercises(
            candidates,
            config,
        );

        return this.buildActivity(exercises, config);
    }

    selectExercises(
        candidates: MathExercise[],
        config: ActivityConfig,
    ): MathExercise[] {
        const level = config.level;
        //const numberOfExercises = config.numberOfExercises;

        const valid = candidates.filter(e =>
            Math.abs(e.difficulty - level) <= 1,
        );
        /*
                const unique = deduplicate(valid, e => e.prompt);
        
                const ranked = unique
                    .map(e => ({
                        exercise: e,
                        score: this.score(e, level),
                    }))
                    .sort((a, b) => b.score - a.score)
                    .map(x => x.exercise);
        
                const balanced = this.balanceByTopic(
                    ranked,
                    numberOfExercises,
                );
        */
        return valid;
    }

    private buildActivity(
        exercises: MathExercise[],
        config: ActivityConfig,
    ): MathActivity {
        const orderedExercises = this.orderExercises(exercises);

        return {
            id: this.uuid(),
            theme: config.theme,
            level: config.level,
            exercises: orderedExercises,
            grading: this.createGrading(config.gradingMethod),
            metadata: {
                createdAt: new Date(),
                /* estimatedDurationMinutes:
                   this.estimateDuration(orderedExercises),*/
            },
        };
    }
    private orderExercises(
        exercises: MathExercise[],
    ): MathExercise[] {
        return [...exercises].sort(
            (a, b) => a.difficulty - b.difficulty,
        );
    }

    private createGrading(
        method: GradingMethod,
    ): GradingStrategy | null {
        //review  
        /*  switch (method) {
          case 'automatic':
            return new AutoGradingStrategy();
          case 'manual':
            return new ManualGradingStrategy();
          case 'hybrid':
            return new PartialCreditGradingStrategy();
          default:
            throw new Error(`Unsupported grading method: ${method}`);*/
            console.log(`Creating grading strategy for method: ${method}`);
        return null;
    }

    uuid(): string {
        // Simple UUID generator for demonstration purposes
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }



}

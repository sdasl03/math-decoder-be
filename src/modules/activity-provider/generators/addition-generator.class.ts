import { Injectable } from "@nestjs/common";
import { GeneratorContext, MathExercise, MathExerciseGenerator, MathTheme } from "src/models/engine-models";
import { SeededRandom } from "src/utils/seeded-random";

import { exerciseId } from "src/utils/utils";

export interface AdditionLevelProfile {
    min: number;
    max: number;
    allowCarry: boolean;
}
export const ADDITION_PROFILES: Record<number, AdditionLevelProfile> = {
    1: { min: 1, max: 9, allowCarry: false },
    2: { min: 10, max: 99, allowCarry: false },
    3: { min: 10, max: 99, allowCarry: true },
    4: { min: 100, max: 999, allowCarry: true },
};

// Seed offset to ensure different RNG sequence than other generators
const ADDITION_SEED_OFFSET = 31;

@Injectable()
export class AdditionGenerator implements MathExerciseGenerator {

    canGenerate(ctx: GeneratorContext): boolean {
        return ctx.theme === 'arithmetic' as MathTheme && ctx.level >= 1;
    }

    generate(ctx: GeneratorContext): MathExercise[] {
        const profile = ADDITION_PROFILES[ctx.level];
        if (!profile) return [];

        const rng = new SeededRandom(ctx.seed + ADDITION_SEED_OFFSET);


        const exercises: MathExercise[] = [];

        while (exercises.length < 10) {
            const a = rng.int(profile.min, profile.max);

            const maxB = profile.allowCarry
                ? profile.max
                : Math.min(profile.max, this.maxNoCarryB(a));

            const b = rng.int(profile.min, maxB);


            if (!profile.allowCarry && this.hasCarry(a, b)) {
                continue;
            }

            exercises.push(this.createExercise(a, b, ctx.level));
        }

        return exercises;
    }

    private maxNoCarryB(a: number): number {
        const magnitude = Math.pow(10, a.toString().length);
        return magnitude - 1 - a;
    }


    private hasCarry(a: number, b: number): boolean {
        return a + b >= Math.pow(10, Math.max(
            a.toString().length,
            b.toString().length,
        ));
    }

    private createExercise(
        a: number,
        b: number,
        level: number,
    ): MathExercise {
        return {
            id: exerciseId({ generator: 'AdditionGenerator', operands: [a, b], level }),
            prompt: `${a} + ${b} = ?`,
            solution: a + b,
            difficulty: level,
            metadata: { topic: 'addition' },
        };
    }
}

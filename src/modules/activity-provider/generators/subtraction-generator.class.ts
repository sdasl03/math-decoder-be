import { SeededRandom } from "src/utils/seeded-random";

import { exerciseId } from "src/utils/utils";
import { GeneratorContext, MathExercise, MathExerciseGenerator, MathTheme } from "src/models/engine-models";
interface SubtractionLevelProfile {
  min: number;
  max: number;
  allowBorrow: boolean;
}

const SUBTRACTION_PROFILES: Record<number, SubtractionLevelProfile> = {
  1: { min: 1, max: 9, allowBorrow: false },
  2: { min: 10, max: 99, allowBorrow: false },
  3: { min: 10, max: 99, allowBorrow: true },
  4: { min: 100, max: 999, allowBorrow: true },
};

export class SubtractionGenerator implements MathExerciseGenerator {

  canGenerate(ctx: GeneratorContext): boolean {
    return ctx.theme === ('arithmetic' as MathTheme) && ctx.level >= 1;
  }

  generate(ctx: GeneratorContext): MathExercise[] {
    const profile = SUBTRACTION_PROFILES[ctx.level];
    if (!profile) return [];

    const rng = new SeededRandom(ctx.seed + 47);
    const exercises: MathExercise[] = [];

    const TARGET = 10;

    while (exercises.length < TARGET) {
      const a = rng.int(profile.min, profile.max);

      const b = profile.allowBorrow
        ? rng.int(profile.min, a) // may borrow
        : rng.int(profile.min, this.maxNoBorrowB(a));

      exercises.push(
        this.createExercise(a, b, ctx.level),
      );
    }

    return exercises;
  }

  /**
   * Ensures no borrowing occurs
   */
  private maxNoBorrowB(a: number): number {
    const magnitude = Math.pow(10, a.toString().length);
    return magnitude - 1 - a;
  }

  private createExercise(
    a: number,
    b: number,
    level: number,
  ): MathExercise {
    return {
      id: exerciseId({
        generator: 'SubtractionGenerator',
        operands: [a, b],
        level,
      }),
      prompt: `${a} − ${b} = ?`,
      solution: a - b,
      difficulty: level,
      metadata: {
        topic: 'subtraction',
        operands: [a, b],
      },
    };
  }
}

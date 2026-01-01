import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { GeneratorContext, MathExercise, MathExerciseGenerator } from "src/models/engine-models";

@Injectable()
export class CompositeExerciseGenerator
  implements MathExerciseGenerator {

  constructor(
    private readonly generators: MathExerciseGenerator[],
  ) {}

  canGenerate(ctx: GeneratorContext): boolean {
    return this.generators.some(g => g.canGenerate(ctx));
  }

  generate(ctx: GeneratorContext): MathExercise[] {
    return this.generators
      .filter(g => g.canGenerate(ctx))
      .flatMap(g => g.generate(ctx));
  }
}

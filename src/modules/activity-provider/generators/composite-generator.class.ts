import { Injectable } from '@nestjs/common';
import { GeneratorContext, MathExercise, MathExerciseGenerator } from 'src/models/engine-models';

@Injectable()
export class CompositeExerciseGenerator implements MathExerciseGenerator {
  private generators: MathExerciseGenerator[];
  
  constructor() {
    this.generators = [];
  }
  registerGenerator(generator: MathExerciseGenerator): void {
    if (!this.generators.includes(generator)) {
      this.generators.push(generator);
    }
  }

  canGenerate(ctx: GeneratorContext): boolean {
    return this.generators.some(g => g.canGenerate(ctx));
  }

  generate(ctx: GeneratorContext): MathExercise[] {
    return this.generators
      .filter(g => g.canGenerate(ctx))
      .flatMap(g => g.generate(ctx));
  }
}
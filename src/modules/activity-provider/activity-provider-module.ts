import { Module } from '@nestjs/common';
import { CompositeExerciseGenerator } from './generators/composite-generator.class';
import { AutoGradingStrategy } from './grading/auto-grading.class';
import { GradingStrategySelector } from './grading/grading-selector.class';
import { HybridGradingStrategy } from './grading/hybrid-grading.class';
import { ManualGradingStrategy } from './grading/manual-grading.class';
import { MathDecoderActivityProvider } from './math-decoder-activity-provider.class';
import { AdditionGenerator } from './generators/addition-generator.class';
import { SubtractionGenerator } from './generators/subtraction-generator.class';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  controllers: [],
  imports:[UtilsModule],
  providers: [
    // Individual generators
    AdditionGenerator,
    SubtractionGenerator,
    
    // Factory provider for CompositeExerciseGenerator
    {
      provide: CompositeExerciseGenerator,
      useFactory: (
        additionGenerator: AdditionGenerator,
        subtractionGenerator: SubtractionGenerator,
      ) => {
        const composite = new CompositeExerciseGenerator();
        composite.registerGenerator(additionGenerator); // Fixed method name
        composite.registerGenerator(subtractionGenerator);
        return composite;
      },
      inject: [AdditionGenerator, SubtractionGenerator],
    },
    
    // Grading strategies
    AutoGradingStrategy,
    ManualGradingStrategy,
    HybridGradingStrategy,
    GradingStrategySelector,
    
    // Main provider
    MathDecoderActivityProvider,
  ],
  exports: [
    // Export actual providers, not the module
    MathDecoderActivityProvider,
    CompositeExerciseGenerator,
    GradingStrategySelector,
    AutoGradingStrategy,
    ManualGradingStrategy,
    HybridGradingStrategy,
  ],
})
export class ActivityProviderModule {}
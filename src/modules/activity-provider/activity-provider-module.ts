import { Module } from '@nestjs/common';
import { CompositeExerciseGenerator } from './generators/composite-generator.class';
import { AutoGradingStrategy } from './grading/auto-grading.class';
import { GradingStrategySelector } from './grading/grading-selector.class';
import { HybridGradingStrategy } from './grading/hybrid-grading.class';
import { ManualGradingStrategy } from './grading/manual-grading.class';
import { MathDecoderActivityProvider } from './math-decoder-activity-provider.class';


@Module({
  controllers: [],
  providers: [CompositeExerciseGenerator,
        AutoGradingStrategy,
        ManualGradingStrategy,
        HybridGradingStrategy,
        GradingStrategySelector,
        MathDecoderActivityProvider],
  exports: [ActivityProviderModule],
})
export class ActivityProviderModule {}

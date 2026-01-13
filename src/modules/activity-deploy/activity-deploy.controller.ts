import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActivityDeployService } from './activity-deploy.service';
import type { ActivityDeployUrl } from './activity-deploy.service';
import * as engineModels from 'src/models/engine-models';
import { MathDecoderActivityProvider } from '../activity-provider/math-decoder-activity-provider.class';

@Controller('activity/:activityId/deploy')
export class ActivityDeployController {
  constructor(private readonly activityDeployService: ActivityDeployService,
    private readonly activityProvider: MathDecoderActivityProvider
  ) {}

  @Get()
  getActivityDeployUrl(
    @Param('activityId') activityId: string,
  ): ActivityDeployUrl {
    return this.activityDeployService.getActivityDeployUrl(activityId);
  }
  
  @Post('submit')
  submitExercise(
    @Param('activityId') activityId: string,
    @Body() submission: engineModels.ExerciseSubmission,
  ): engineModels.GradingResult {
    // Ensure the submission matches the activity ID
    return this.activityProvider.gradeSubmission({
      ...submission,
      activityId,
    });
  }
}

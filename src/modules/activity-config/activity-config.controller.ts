import { Controller, Get, Param, Logger, BadRequestException } from '@nestjs/common';
import { ActivityConfigService } from './activity-config.service';
import { IActivityConfig } from 'src/models/engine-models';

@Controller('activity/config')
export class ActivityConfigController {
  private readonly logger = new Logger(ActivityConfigController.name);

  private readonly defaultConfig: IActivityConfig = {
    id: 'default',
    theme: 'arithmetic',
    level: 1,
    numberOfExercises: 10,
    gradingMethod: 'automatic'
  };

  constructor(private readonly activityConfigService: ActivityConfigService) { }

  @Get()
  async getActivityConfig(@Param('activityId') activityId: string): Promise<IActivityConfig> {
    if (!activityId) {
      throw new BadRequestException('Activity ID is required');
    }

    try {
      return await this.activityConfigService.getActivityConfig(activityId);
    } catch (error) {
      this.logger.warn(
        `Failed to fetch activity config for ID ${activityId}, using defaults`,
        error instanceof Error ? error.message : String(error)
      );
      return { ...this.defaultConfig, id: activityId };
    }
  }
}

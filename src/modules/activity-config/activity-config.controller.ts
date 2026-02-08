import { Controller, Get, Param, Logger, BadRequestException } from '@nestjs/common';
import { ActivityConfigService } from './activity-config.service';

interface IActivityConfig {
  id: string;
  theme: string;
  level: number;
  numberOfExercises: number;
  gradingMethod: string;
}

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
  async getActivityConfig(@Param('activityId') activityId: string): Promise<string> {
    if (!activityId) {
      throw new BadRequestException('Activity ID is required');
    }

    try {
      const config = await this.activityConfigService.getActivityConfig(activityId);
      return JSON.stringify(config);
    } catch (error) {
      this.logger.warn(
        `Failed to fetch activity config for ID ${activityId}, using defaults`,
        error instanceof Error ? error.message : String(error)
      );
      return JSON.stringify({ ...this.defaultConfig, id: activityId });
    }
  }
}

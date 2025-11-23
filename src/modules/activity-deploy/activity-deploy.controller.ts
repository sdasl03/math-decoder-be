import { Controller, Get, Param } from '@nestjs/common';
import { ActivityDeployService } from './activity-deploy.service';
import type { ActivityDeployUrl } from './activity-deploy.service';

@Controller('activity/:activityId/deploy')
export class ActivityDeployController {
  constructor(private readonly activityDeployService: ActivityDeployService) {}

  @Get()
  getActivityDeployUrl(
    @Param('activityId') activityId: string,
  ): ActivityDeployUrl {
    return this.activityDeployService.getActivityDeployUrl(activityId);
  }
}

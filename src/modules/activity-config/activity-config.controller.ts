import { Controller, Get, Param } from '@nestjs/common';
import { ActivityConfigService } from './activity-config.service';

@Controller('activity/config')
export class ActivityConfigController {
  constructor(private readonly activityConfigService: ActivityConfigService) { }

  @Get()
  getActivityConfig(@Param('activityId') activityId: string): string {
    return this.activityConfigService.getActivityConfig(activityId);
  }
}

import { Controller, Get } from '@nestjs/common';
import { ActivityConfigService } from './activity-config.service';

@Controller('activity/config')
export class ActivityConfigController {
  constructor(private readonly activityConfigService: ActivityConfigService) {}

  @Get()
  getActivityConfig(): string {
    return this.activityConfigService.getActivityConfig();
  }
}

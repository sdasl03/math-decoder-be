import { Controller, Get } from '@nestjs/common';
import { ActivityParamsService } from './activity-params.service';
import { Param } from '../../models/models';

@Controller('activity/params')
export class ActivityParamsController {
  constructor(private readonly activityParamsService: ActivityParamsService) {}

  @Get()
  getActivityParams(): Param[] {
    return this.activityParamsService.getActivityParams();
  }
}

import { Controller, Get } from '@nestjs/common';
import { ActivityParamsService } from './activity-params.service';
import type { Param } from '../../models/intefaces';

@Controller('activity/params')
export class ActivityParamsController {
  constructor(private readonly activityParamsService: ActivityParamsService) {}

  @Get()
  getActivityParams(): Param[] {
    return this.activityParamsService.getActivityParams();
  }
}

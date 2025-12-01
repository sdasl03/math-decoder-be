import { Controller, Post, Body, Get } from '@nestjs/common';
import { ActivityAnalyticsService } from './activity-analytics.service';
import type {   ActivityAnalyticsDefinition,
  ConsultAnalyticsDto,
  UserAnalytics, } from '../../models/models';

@Controller('activity/analytics')
export class ActivityAnalyticsController {
  constructor(
    private readonly activityAnalyticsService: ActivityAnalyticsService,
  ) {}

  @Post()
  consultAnalytics(
    @Body() consultAnalyticsDto: ConsultAnalyticsDto,
  ): UserAnalytics[] {
    return this.activityAnalyticsService.getActivityAnalytics(
      consultAnalyticsDto.activityId,
    );
  }

  @Get()
  getListOfActivitiesAnalytics(): ActivityAnalyticsDefinition {
    return this.activityAnalyticsService.getListOfActivitiesAnalytics();
  }
}

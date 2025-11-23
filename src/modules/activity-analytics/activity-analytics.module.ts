import { Module } from '@nestjs/common';
import { ActivityAnalyticsService } from './activity-analytics.service';
import { ActivityAnalyticsController } from './activity-analytics.controller';

@Module({
  controllers: [ActivityAnalyticsController],
  providers: [ActivityAnalyticsService],
  exports: [ActivityAnalyticsService],
})
export class ActivityAnalyticsModule {}

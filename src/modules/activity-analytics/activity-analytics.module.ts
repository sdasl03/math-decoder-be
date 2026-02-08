import { Module } from '@nestjs/common';
import { ActivityAnalyticsService } from './activity-analytics.service';
import { ActivityAnalyticsController } from './activity-analytics.controller';
import { AnalyticsRepository } from './repositories/analytics.repository';

@Module({
  controllers: [ActivityAnalyticsController],
  providers: [ActivityAnalyticsService, AnalyticsRepository],
  exports: [ActivityAnalyticsService],
})
export class ActivityAnalyticsModule {}

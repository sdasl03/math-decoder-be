import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityConfigModule } from './modules/activity-config/activity-config.module';
import { ActivityParamsModule } from './modules/activity-params/activity-params.module';
import { ActivityDeployModule } from './modules/activity-deploy/activity-deploy.module';
import { ActivityAnalyticsModule } from './modules/activity-analytics/activity-analytics.module';

@Module({
  imports: [
    ActivityConfigModule,
    ActivityParamsModule,
    ActivityDeployModule,
    ActivityAnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

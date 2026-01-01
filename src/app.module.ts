import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityConfigModule } from './modules/activity-config/activity-config.module';
import { ActivityParamsModule } from './modules/activity-params/activity-params.module';
import { ActivityDeployModule } from './modules/activity-deploy/activity-deploy.module';
import { ActivityAnalyticsModule } from './modules/activity-analytics/activity-analytics.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ActivityConfigModule,
    ActivityParamsModule,
    ActivityDeployModule,
    ActivityAnalyticsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActivityDeployController } from './activity-deploy.controller';
import { ActivityDeployService } from './activity-deploy.service';
import { ActivityProviderModule } from '../activity-provider/activity-provider-module';

@Module({
  imports: [
    ConfigModule,  // Needed for ConfigService in ActivityDeployService
    ActivityProviderModule, // This imports all the providers you need
  ],
  controllers: [ActivityDeployController],
  providers: [ActivityDeployService],
  exports: [ActivityDeployService],
})
export class ActivityDeployModule {}
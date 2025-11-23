import { Module } from '@nestjs/common';
import { ActivityDeployService } from './activity-deploy.service';
import { ActivityDeployController } from './activity-deploy.controller';

@Module({
  controllers: [ActivityDeployController],
  providers: [ActivityDeployService],
  exports: [ActivityDeployService],
})
export class ActivityDeployModule {}

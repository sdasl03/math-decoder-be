import { Module } from '@nestjs/common';
import { ActivityConfigService } from './activity-config.service';
import { ActivityConfigController } from './activity-config.controller';

@Module({
  imports: [],
  controllers: [ActivityConfigController],
  providers: [ActivityConfigService],
  exports: [ActivityConfigService],
})
export class ActivityConfigModule {}

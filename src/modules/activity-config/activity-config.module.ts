import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ActivityConfigService } from './activity-config.service';
import { ActivityConfigController } from './activity-config.controller';

@Module({
  imports: [HttpModule],
  controllers: [ActivityConfigController],
  providers: [ActivityConfigService],
  exports: [ActivityConfigService],
})
export class ActivityConfigModule {}

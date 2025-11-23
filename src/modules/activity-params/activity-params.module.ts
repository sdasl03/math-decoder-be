import { Module } from '@nestjs/common';
import { ActivityParamsService } from './activity-params.service';
import { ActivityParamsController } from './activity-params.controller';

@Module({
  controllers: [ActivityParamsController],
  providers: [ActivityParamsService],
  exports: [ActivityParamsService],
})
export class ActivityParamsModule {}

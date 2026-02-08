import { Module } from '@nestjs/common';
import { ClockService } from './clock.service';
import { UuidService } from './uuid.service';

@Module({
  providers: [ClockService, UuidService],
  exports: [ClockService, UuidService],
})
export class UtilsModule {}

import { Injectable } from '@nestjs/common';

@Injectable()
export class ClockService {
    now(): Date {
        return new Date();
    }
    
    currentTimeMs(): number {
        return Date.now();
    }
}
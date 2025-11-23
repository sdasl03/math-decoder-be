import { Injectable } from '@nestjs/common';

export interface ActivityConfig {
  id: string;
  config: string;
}

@Injectable()
export class ActivityConfigService {
  url: string = 'https://math-decoder-config.onrender.com/';

  getActivityConfig(): string {
    // Return activity configuration page details
    return this.url;
  }
}

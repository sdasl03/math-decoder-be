import { Injectable } from '@nestjs/common';


@Injectable()
export class ActivityConfigService {
  url: string = 'https://math-decoder-config.onrender.com/';

  getActivityConfig(activityId: string): string {
    // Return activity configuration page details
    //fetch the config according to activityId
    console.log(`Fetching config for activityId: ${activityId}`);
    return this.url;
  }
}

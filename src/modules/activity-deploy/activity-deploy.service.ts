import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ActivityDeployUrl {
  userUrl: string;
}

@Injectable()
export class ActivityDeployService {
  private readonly logger = new Logger(ActivityDeployService.name);
  private readonly deployBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.deployBaseUrl = this.configService.get<string>(
      'DEPLOY_BASE_URL',
      'https://deploy.example.com/'
    );
  }

  getActivityDeployUrl(activityId: string): ActivityDeployUrl {
    this.logger.debug(`Retrieving deploy URL for activity: ${activityId}`);
    return {
      userUrl: `${this.deployBaseUrl}activities/${activityId}`
    };
  }
}

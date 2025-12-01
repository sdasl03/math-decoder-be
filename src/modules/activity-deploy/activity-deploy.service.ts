import { Injectable } from '@nestjs/common';

export interface ActivityDeployUrl {
  userUrl: string;
}

@Injectable()
export class ActivityDeployService {
  deployUrl: ActivityDeployUrl = { userUrl: 'https://deploy.example.com/' };

  getActivityDeployUrl(activityId: string): ActivityDeployUrl {
    // generates space to store analytics for this activity instance, generate an activityID(for it is a new instance)
    console.log(`Deploying activity with activityId: ${activityId}`);
    //const activityId = `activity-${Math.random().toString(36).substr(2, 9)}`;
    // Return URL to access the deployed activity
    return this.deployUrl;
  }

  
}

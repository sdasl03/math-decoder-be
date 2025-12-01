import { Injectable } from '@nestjs/common';
import {
  ActivityAnalytics, ActivityAnalyticsDefinition,
  UserAnalytics,
} from '../../models/models';

@Injectable()
export class ActivityAnalyticsService {
  analyticsDefinition: ActivityAnalyticsDefinition = {
    qualAnalytics: [{ name: 'Student feedback', type: 'string' }],
    quantAnalytics: [
      { name: 'Total number of submissions', type: 'number' },
      { name: 'Total amount of time spent', type: 'number' },
      { name: 'Total number of challenges completed', type: 'number' },
    ],
  };

  activitiesAnalyticsData: UserAnalytics[] = [
    {
      inveniraStdID: 1001,
      quantAnalytics: [
        {
          name: 'Total number of submissions',
          value: 5,
        },
        {
          name: 'Total amount of time spent',
          value: 120,
        },
        {
          name: 'Total number of challenges completed',
          value: 3,
        },
      ],
      qualAnalytics: [
        {
          name: 'Student feedback',
          value: 'Great progress!',
        },
      ],
    },
    {
      inveniraStdID: 1002,
      quantAnalytics: [
        {
          name: 'Total number of submissions',
          value: 2,
        },
        {
          name: 'Total amount of time spent',
          value: 45,
        },
        {
          name: 'Total number of challenges completed',
          value: 1,
        },
      ],
      qualAnalytics: [
        {
          name: 'Student feedback',
          value: 'Needs more practice.',
        },
      ],
    },
  ];
  activitiesAnalaytics: ActivityAnalytics[] = [
    {
      id: 'activity-001',
      userAnalytics: this.activitiesAnalyticsData,
    },
  ];

  getActivityAnalytics(activityId: string): UserAnalytics[] {
    //return analytics for a specific activity
    return (
      this.activitiesAnalaytics.find((activity) => activity.id === activityId)
        ?.userAnalytics || []
    );
  }
  getListOfActivitiesAnalytics(): ActivityAnalyticsDefinition {
    // Return list of all activities analytics
    return this.analyticsDefinition;
  }
}

import { Injectable } from '@nestjs/common';
import { UserAnalytics, ActivityAnalytics } from 'src/models/models';

// Seed data for development environment
const SEED_ANALYTICS: UserAnalytics[] = [
    {
        inveniraStdID: 1001,
        quantAnalytics: [
            { name: 'Total number of submissions', value: 5 },
            { name: 'Total amount of time spent', value: 120 },
            { name: 'Total number of challenges completed', value: 3 },
        ],
        qualAnalytics: [
            { name: 'Student feedback', value: 'Great progress!' },
        ],
    },
    {
        inveniraStdID: 1002,
        quantAnalytics: [
            { name: 'Total number of submissions', value: 2 },
            { name: 'Total amount of time spent', value: 45 },
            { name: 'Total number of challenges completed', value: 1 },
        ],
        qualAnalytics: [
            { name: 'Student feedback', value: 'Needs more practice.' },
        ],
    },
];

const SEED_ACTIVITY: ActivityAnalytics = {
    id: 'activity-001',
    userAnalytics: SEED_ANALYTICS,
};

@Injectable()
export class AnalyticsRepository {
    private userAnalyticsMap = new Map<number, UserAnalytics>();
    private activitiesAnalytics: ActivityAnalytics[] = [];

    async getAnalyticsForActivity(activityId: string): Promise<UserAnalytics[]> {
        const activity = this.activitiesAnalytics.find(a => a.id === activityId);
        return activity?.userAnalytics || [];
    }

    async getAllActivityAnalytics(): Promise<ActivityAnalytics[]> {
        return [...this.activitiesAnalytics];
    }

    async saveUserAnalytics(analytics: UserAnalytics): Promise<void> {
        this.userAnalyticsMap.set(analytics.inveniraStdID, analytics);
    }

    /**
     * Retrieve individual user analytics by ID
     */
    async getUserAnalytics(studentId: number): Promise<UserAnalytics | null> {
        return this.userAnalyticsMap.get(studentId) || null;
    }

    async saveActivityAnalytics(analytics: ActivityAnalytics): Promise<void> {
        const index = this.activitiesAnalytics.findIndex(a => a.id === analytics.id);
        if (index >= 0) {
            this.activitiesAnalytics[index] = analytics;
        } else {
            this.activitiesAnalytics.push(analytics);
        }
    }

    async initializeSeedData(): Promise<void> {
        for (const analytics of SEED_ANALYTICS) {
            await this.saveUserAnalytics(analytics);
        }

        await this.saveActivityAnalytics(SEED_ACTIVITY);
    }
}
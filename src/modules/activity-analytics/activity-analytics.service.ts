import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ActivityAnalytics, ActivityAnalyticsDefinition,
  UserAnalytics,
} from '../../models/models';
import { AnalyticsRepository } from './repositories/analytics.repository';

@Injectable()
export class ActivityAnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(ActivityAnalyticsService.name);

  private analyticsDefinition: ActivityAnalyticsDefinition = {
    qualAnalytics: [{ name: 'Student feedback', type: 'string' }],
    quantAnalytics: [
      { name: 'Total number of submissions', type: 'number' },
      { name: 'Total amount of time spent', type: 'number' },
      { name: 'Total number of challenges completed', type: 'number' },
    ],
  };

  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
      if (nodeEnv === 'development') {
        this.logger.log('Initializing analytics seed data...');
        await this.analyticsRepository.initializeSeedData();
        this.logger.log('Analytics seed data initialized successfully');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to initialize Analytics seed data: ${message}`,
        error instanceof Error ? error.stack : undefined
      );
      // Continue even if seed data fails - not critical
    }
  }

  async getActivityAnalytics(activityId: string): Promise<UserAnalytics[]> {
    return await this.analyticsRepository.getAnalyticsForActivity(activityId);
  }

  getListOfActivitiesAnalytics(): ActivityAnalyticsDefinition {
    return this.analyticsDefinition;
  }

  async getAllActivitiesAnalytics(): Promise<ActivityAnalytics[]> {
    return await this.analyticsRepository.getAllActivityAnalytics();
  }
}

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';

export interface IActivityConfig {
  id: string;
  theme: string;
  level: number;
  numberOfExercises: number;
  gradingMethod: string;
}

@Injectable()
export class ActivityConfigService {
  private readonly logger = new Logger(ActivityConfigService.name);
  private readonly baseUrl: string;
  private readonly requestTimeoutMs = 5000;
  private readonly maxRetries = 3;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'ACTIVITY_CONFIG_URL',
      'https://math-decoder-config.onrender.com/'
    );
  }

  async getActivityConfig(activityId: string): Promise<IActivityConfig> {
    if (!activityId) {
      throw new HttpException(
        'Activity ID is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const url = `${this.baseUrl}/activities/${activityId}`;
      
      const response = await firstValueFrom(
        this.httpService.get<IActivityConfig>(url).pipe(
          timeout(this.requestTimeoutMs),
          retry(this.maxRetries),
        ),
      );

      if (!response.data) {
        throw new HttpException(
          'Empty response from config service',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching activity config for ${activityId}: ${error.message}`,
      );
      
      // Re-throw with appropriate status
      if (error.response) {
        throw new HttpException(
          error.response.data?.message || 'Failed to fetch config',
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      throw new HttpException(
        'Config service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getActivityConfigWithFallback(
    activityId: string,
    fallback: IActivityConfig,
  ): Promise<IActivityConfig> {
    try {
      return await this.getActivityConfig(activityId);
    } catch (error) {
      this.logger.warn(
        `Using fallback config for activity ${activityId} because of error: ${error.message}`,
      );
      return fallback;
    }
  }
}
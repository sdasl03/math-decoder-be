import { Injectable } from '@nestjs/common';
import { Param } from '../../models/models';

// Default activity parameters - can be extended or overridden via configuration
const DEFAULT_ACTIVITY_PARAMS: Param[] = [
  { name: 'theme', type: 'text/plain' },
  { name: 'level', type: 'text/plain' },
  { name: 'timelimit', type: 'text/plain' },
  { name: 'numberOfExercises', type: 'text/plain' },
  { name: 'gradingMethod', type: 'text/plain' },
];

@Injectable()
export class ActivityParamsService {
  private listOfParams: Param[] = [...DEFAULT_ACTIVITY_PARAMS];

  getActivityParams(): Param[] {
    return [...this.listOfParams];  // Return copy to prevent external mutations
  }

  /**
   * Add or override activity parameters
   * @param params New parameters to add or update
   */
  setActivityParams(params: Param[]): void {
    if (!params?.length) {
      throw new Error('Parameters cannot be empty');
    }
    this.listOfParams = [...params];
  }

  /**
   * Add a single parameter
   */
  addParameter(param: Param): void {
    if (!param?.name) {
      throw new Error('Parameter name is required');
    }
    const exists = this.listOfParams.some(p => p.name === param.name);
    if (!exists) {
      this.listOfParams.push(param);
    }
  }
}

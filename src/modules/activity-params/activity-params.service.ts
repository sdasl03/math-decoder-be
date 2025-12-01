import { Injectable } from '@nestjs/common';
import { Param } from '../../models/models';

@Injectable()
export class ActivityParamsService {
  listOfParams: Param[] = [
    { name: 'theme', type: 'text/plain' },
    { name: 'level', type: 'text/plain' },
    { name: 'timelimit', type: 'text/plain' },
    { name: 'numberOfExercises', type: 'text/plain' },
    { name: 'gradingMethod', type: 'text/plain' },
  ];

  getActivityParams(): Param[] {
    // Return list of parameters available in the configuration page
    return this.listOfParams;
  }
}

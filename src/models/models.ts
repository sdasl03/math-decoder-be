
export class AnalyticsBase {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export class Analytics<T = any> extends AnalyticsBase {
  value: T;
  constructor(name: string, value: T ) {
    super(name);
    this.value = value;
  }
}

export class Param<T = any> extends AnalyticsBase {
  type: T;
  constructor(name: string, type: T) {
    super(name);
    this.type = type;
  }
}

export interface UserAnalytics<Q = any, QL = any> {
  inveniraStdID: number;
  quantAnalytics: Analytics<Q>[];
  qualAnalytics: Analytics<QL>[];
}

export interface ActivityAnalytics<Q = any, QL = any> {
  id: string;
  userAnalytics: UserAnalytics<Q, QL>[];
}

export interface ActivityAnalyticsDefinition<QT = any, QLT = any> {
  qualAnalytics: Param<QLT>[];
  quantAnalytics: Param<QT>[];
}
export interface ConsultAnalyticsDto {
  activityId: string;
}


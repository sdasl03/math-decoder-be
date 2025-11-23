export interface Analytics {
  name: string;
  value: any;
}
export interface QualAnalytics {
  name: string;
  value: string;
}
export interface Param {
  name: string;
  type: any;
}

export interface UserAnalytics {
  inveniraStdID: number;
  quantAnalytics: Analytics[];
  qualAnalytics: any[];
}

export interface ActivityAnalytics {
  id: string;
  userAnalytics: UserAnalytics[];
}

export interface ActivityAnalyticsDefinition {
  qualAnalytics: Param[];
  quantAnalytics: Param[];
}
export interface ConsultAnalyticsDto {
  activityId: string;
}

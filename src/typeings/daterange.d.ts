import moment = require("moment");

export interface DateRange {
    startDate: string;
    endDate: string;
    label?: string;
  }

export interface DateRangeSel {
    startDate: moment.Moment;
    endDate: moment.Moment;
}
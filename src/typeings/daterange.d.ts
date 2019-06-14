import moment = require("moment");

export interface DateRange {
    start: string;
    end: string;
    label: string;
  }

export interface DateRangeSel {
    start: moment.Moment;
    end: moment.Moment;
    label: string
}
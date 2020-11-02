import {inject, TestBed  } from '@angular/core/testing';

import { ArQueryService } from './ar-query.service';
import { Router, ActivatedRoute} from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing';
import { filter } from 'rxjs/operators';

import { DateRange } from './../../typeings/daterange'
import * as moment from 'moment'

describe('ArQueryService', () => {
  let service: ArQueryService;
  let router: Router;
  let route: ActivatedRoute;
  let queryParamsDefault: Object;
  let spy_reset_params: jasmine.Spy
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ArQueryService ],
      imports: [ RouterTestingModule ]
    })
    service = TestBed.inject(ArQueryService);

    router = TestBed.get(Router)
    route = TestBed.get(ActivatedRoute)
    
    spy_reset_params = spyOn(service, 'resetParams').and.callThrough()

    queryParamsDefault = {
      includeRealtime: true,
      onlyBGC: false,
      onlyDeep: false,
      arHourRange: [-18, 18],
      arDate: "2010-01-01T00",
      displayGlobally: true
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });  

  it('should be emit a change upon emit', () => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('hello');
    });

    service.change.emit('hello')

  });

  it('should set url with default state', done => {
    const queryParamsDefaultKeys = Object.keys(queryParamsDefault)
      service.set_url()
      route.queryParamMap.pipe(
        filter(params => !!params.keys.length), // filter out any emissions where keys is an empty array.
      ).subscribe( params => {
        expect(params.keys).toEqual(queryParamsDefaultKeys);
        done();
      })
  })

  it('should check if all params change', () => {
    const broadcastChange=false
    const rtTog = false
    const bgcTog = true
    const deepTog = true
    const arDR = [-1,1]
    const arDrDefault = [-18, 18]
    const arDate = moment(new Date( ))
    const arDateDefault = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    const dispGlob = false
    //check if set to defaults
    expect(service.get_realtime_toggle()).toEqual(!rtTog)
    expect(service.get_bgc_toggle()).toEqual(!bgcTog)
    expect(service.get_deep_toggle()).toEqual(!deepTog)
    expect(service.get_ar_date_range()).toEqual(arDrDefault)
    expect(service.get_ar_date()).toEqual(arDateDefault)
    expect(service.get_display_globally()).toEqual(!dispGlob)    
    //change all params to non default
    service.sendRealtimeMsg(rtTog, broadcastChange)
    service.sendBGCToggleMsg(bgcTog, broadcastChange)
    service.sendDeepToggleMsg(deepTog, broadcastChange)
    service.send_ar_date_range(arDR, broadcastChange)
    service.send_ar_date(arDate)
    service.send_display_globally(dispGlob, broadcastChange)
    //check if changed
    expect(service.get_realtime_toggle()).toEqual(rtTog)
    expect(service.get_bgc_toggle()).toEqual(bgcTog)
    expect(service.get_deep_toggle()).toEqual(deepTog)
    expect(service.get_ar_date_range()).toEqual(arDR)
    expect(service.get_ar_date()).toEqual(arDate)
    expect(service.get_display_globally()).toEqual(dispGlob)
  })

  it('should reset to default upon reset event', () => {
    
    const broadcastChange=false
    const rtTog = false
    const bgcTog = true
    const deepTog = true
    const arDR = [-1,1]
    const arDrDefault = [-18, 18]
    const arDate = moment(new Date( ))
    const arDateDefault = moment(new Date( 2010, 0, 1, 0, 0, 0, 0))
    const dispGlob = false
    //change all params to non default
    service.sendRealtimeMsg(rtTog, broadcastChange)
    service.sendBGCToggleMsg(bgcTog, broadcastChange)
    service.sendDeepToggleMsg(deepTog, broadcastChange)
    service.send_ar_date_range(arDR, broadcastChange)
    service.send_ar_date(arDate)
    service.send_display_globally(dispGlob, broadcastChange)

    service.trigger_reset_to_start()

    expect(spy_reset_params).toHaveBeenCalledTimes(1)
    //check if set to defaults
    expect(service.get_realtime_toggle()).toEqual(!rtTog)
    expect(service.get_bgc_toggle()).toEqual(!bgcTog)
    expect(service.get_deep_toggle()).toEqual(!deepTog)
    expect(service.get_ar_date_range()).toEqual(arDrDefault)
    expect(service.get_ar_date()).toEqual(arDateDefault)
    expect(service.get_display_globally()).toEqual(!dispGlob)   
  })

  it('should convert ar date and hour range into a date range for profile selection', () => {
    const defaultSelectionDates = service.get_selection_dates()
    const defaultArDate = { startDate: "2009-12-31T06:00:00Z", endDate: "2010-01-01T18:00:00Z", label: "" } as DateRange
    expect(defaultSelectionDates.startDate === defaultArDate.startDate).toEqual(false)
    expect(defaultSelectionDates.endDate === defaultArDate.endDate).toEqual(false)

    service.set_selection_date_range()

    const selectionDates = service.get_selection_dates()
    expect(selectionDates.startDate).toEqual(defaultArDate.startDate)
    expect(selectionDates.endDate).toEqual(defaultArDate.endDate)
  })

});

import {inject, TestBed  } from '@angular/core/testing';

import { ArQueryService } from './ar-query.service';
import { Router, ActivatedRoute} from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing';
import { query } from '@angular/animations';
import { filter } from 'rxjs/operators';

import * as moment from 'moment'

describe('ArQueryService', () => {
  let service: ArQueryService;
  let router: Router;
  let route: ActivatedRoute;
  let queryParamsDefault: Object;
  let spyResetParams: jasmine.Spy
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ArQueryService ],
      imports: [ RouterTestingModule ]
    })
    service = TestBed.inject(ArQueryService);

    router = TestBed.get(Router)
    route = TestBed.get(ActivatedRoute)
    
    spyResetParams = spyOn(service, 'resetParams').and.callThrough()

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
      service.setURL()
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
    expect(service.getRealtimeToggle()).toEqual(!rtTog)
    expect(service.getBGCToggle()).toEqual(!bgcTog)
    expect(service.getDeepToggle()).toEqual(!deepTog)
    expect(service.getArDateRange()).toEqual(arDrDefault)
    expect(service.getArDate()).toEqual(arDateDefault)
    expect(service.getDisplayGlobally()).toEqual(!dispGlob)    
    //change all params to non default
    service.sendRealtimeMsg(rtTog, broadcastChange)
    service.sendBGCToggleMsg(bgcTog, broadcastChange)
    service.sendDeepToggleMsg(deepTog, broadcastChange)
    service.sendArDateRange(arDR, broadcastChange)
    service.sendArDate(arDate)
    service.sendDisplayGlobally(dispGlob, broadcastChange)
    //check if changed
    expect(service.getRealtimeToggle()).toEqual(rtTog)
    expect(service.getBGCToggle()).toEqual(bgcTog)
    expect(service.getDeepToggle()).toEqual(deepTog)
    expect(service.getArDateRange()).toEqual(arDR)
    expect(service.getArDate()).toEqual(arDate)
    expect(service.getDisplayGlobally()).toEqual(dispGlob)
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
    service.sendArDateRange(arDR, broadcastChange)
    service.sendArDate(arDate)
    service.sendDisplayGlobally(dispGlob, broadcastChange)

    service.triggerResetToStart()

    expect(spyResetParams).toHaveBeenCalledTimes(1)
    //check if set to defaults
    expect(service.getRealtimeToggle()).toEqual(!rtTog)
    expect(service.getBGCToggle()).toEqual(!bgcTog)
    expect(service.getDeepToggle()).toEqual(!deepTog)
    expect(service.getArDateRange()).toEqual(arDrDefault)
    expect(service.getArDate()).toEqual(arDateDefault)
    expect(service.getDisplayGlobally()).toEqual(!dispGlob)   
  })


});

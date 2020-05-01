import { TestBed, inject } from '@angular/core/testing';
import { QueryService } from './query.service';

import "leaflet";
import "leaflet-draw";
import "proj4leaflet";

import * as L from "leaflet";
//import { geoJSON, GeoJSON } from 'leaflet';

import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('QueryService', () => {
  let route: ActivatedRoute;
  let queryParamsDefault: Object;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ QueryService ],
      imports: [ RouterTestingModule ]
    });

    route = TestBed.get(ActivatedRoute)
    queryParamsDefault = {
                         mapProj: 'WM',
                         presRange: '[0,2000]', 
                         selectionStartDate: "2010-01-01T00",
                         selectionEndDate: "2010-01-14T00", 
                         threeDayEndDate: "2010-01-14",
                         includeRealtime: "true",
                         onlyBGC: "true", 
                         onlyDeep: "true",
                         threeDayToggle: "true",
                       } 
  });

  it('should be created', inject([QueryService], (service: QueryService) => {
    expect(service).toBeTruthy();
  }));

  it('should set url with state', done => {
    const queryParamsDefaultKeys = Object.keys(queryParamsDefault)
    const qpdkStr = JSON.stringify(queryParamsDefaultKeys.sort())
    inject([QueryService], (service: QueryService) => {
      service.setURL()
      route.queryParamMap.subscribe( params => {
        const paramsStr = JSON.stringify(params.keys.sort())
        const equal = paramsStr === qpdkStr 
        if (params.keys.length == 0 ) {
          console.log('no parameters set. not testing')
        }
        else {
          console.log('here be parameter keys')
          expect(paramsStr).toEqual(qpdkStr)
        }
        done();
      })
    })();
  });


  it('should be emit a change upon emit', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('hello');
    });

    service.change.emit('hello')

  }));

  it('should be emit a change upon shape creation', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('shape');
    });

    const shape = [[[-67.13734351262877, 45.137451890638886],
    [-66.96466, 44.8097],
    [-68.03252, 44.3252],
    [-67.79035274928509, 47.066248887716995],
    [-67.79141211614706, 45.702585354182816],
    [-67.13734351262877, 45.137451890638886]]]

    const broadcastChange=true
    const toggleThreeDayOff=false
    service.sendShape(shape, broadcastChange, toggleThreeDayOff) // need to cast as GeoJSON.Feature[] object
  }));

  it('should be emit a change upon pressure change', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('presRange');
    });
    const presRange = [0, 2000]
    service.sendPres(presRange)
  }));

  it('should be emit a change upon date change', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('three day display date');
    });
    const globalDisplayDate = "2018-09-14"
    service.sendGlobalDate(globalDisplayDate)
  }));

  it('should be emit a change upon toggle change', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('realtime');
    });
    const toggleOn = true
    service.sendRealtimeMsg(toggleOn)
  }));
});

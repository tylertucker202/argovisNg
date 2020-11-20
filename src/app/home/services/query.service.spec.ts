import { TestBed } from '@angular/core/testing';
import { QueryService } from './query.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators'

describe('QueryService', () => {
  let service: QueryService
  let route: ActivatedRoute;
  let queryParamsDefault: Object;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ QueryService ],
      imports: [ RouterTestingModule ]
    });
    service = TestBed.inject(QueryService)
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should set url with state', done => {
    const queryParamsDefaultKeys = Object.keys(queryParamsDefault)
      service.set_url()
      route.queryParamMap.pipe(
        filter(params => !!params.keys.length), // filter out any emissions where keys is an empty array.
      ).subscribe( params => {
        expect(params.keys).toEqual(queryParamsDefaultKeys);
        done();
      })
  })

  it('should be emit a change upon emit', () => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('hello');
    });

    service.change.emit('hello')

  });

  it('should be emit a change upon shape creation', () => {
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
    service.send_shape(shape, broadcastChange, toggleThreeDayOff) // need to cast as GeoJSON.Feature[] object
  });

  it('should be emit a change upon pressure change', () => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('presRange');
    });
    const presRange = [0, 2000] as [number, number]
    service.send_pres(presRange)
  });

  it('should be emit a change upon date change', () => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('three day display date');
    });
    const globalDisplayDate = "2018-09-14"
    service.send_global_date(globalDisplayDate)
  });

  it('should be emit a change upon toggle change', () => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('realtime');
    });
    const toggleOn = true
    service.send_realtime_msg(toggleOn)
  });
});

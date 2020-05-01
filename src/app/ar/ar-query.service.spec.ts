import {inject, TestBed  } from '@angular/core/testing';

import { ArQueryService } from './ar-query.service';
import { Router, ActivatedRoute} from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing';
import { query } from '@angular/animations';

describe('ArQueryService', () => {
  let service: ArQueryService;
  let router: Router;
  let route: ActivatedRoute;
  let queryParamsDefault: Object;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ArQueryService ],
      imports: [ RouterTestingModule ]
    })
    service = TestBed.inject(ArQueryService);

    router = TestBed.get(Router)
    route = TestBed.get(ActivatedRoute)

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

  it('should be emit a change upon emit', inject([ArQueryService], (service: ArQueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('hello');
    });

    service.change.emit('hello')

  }));

  it('should set url with state', done => {
    const queryParamsDefaultKeys = Object.keys(queryParamsDefault)
    inject([ArQueryService], (service: ArQueryService) => {
      service.setURL()
      route.queryParamMap.subscribe( params => {
        const equal = params.keys === queryParamsDefaultKeys 
        if (params.keys.length == 0 ) {
          console.log('no parameters set. not testing')
        }
        else {
          console.log('here be parameter keys')
          expect(params.keys).toEqual(queryParamsDefaultKeys)
        }
        done();
      })
    })();
  });

});

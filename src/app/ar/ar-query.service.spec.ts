import {inject, TestBed  } from '@angular/core/testing';

import { ArQueryService } from './ar-query.service';
import { Router, ActivatedRoute} from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing';
import { query } from '@angular/animations';
import { filter } from 'rxjs/operators';

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

  it('should be emit a change upon emit', () => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('hello');
    });

    service.change.emit('hello')

  });

  it('should set url with state', done => {
    const queryParamsDefaultKeys = Object.keys(queryParamsDefault)
      service.setURL()
      route.queryParamMap.pipe(
        filter(params => !!params.keys.length), // filter out any emissions where keys is an empty array.
      ).subscribe( params => {
        expect(params.keys).toEqual(queryParamsDefaultKeys);
        done();
      })
  })

});

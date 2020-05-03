import { TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { QueryGridService } from './query-grid.service';
import { RouterTestingModule } from '@angular/router/testing';
import { filter } from 'rxjs/operators'

describe('QueryGridService', () => {
  let service: QueryGridService
  let route: ActivatedRoute
  let queryParamsDefault: Object
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ QueryGridService ],
      imports: [ RouterTestingModule ]
    });

    service = TestBed.inject(QueryGridService)
    route = TestBed.get(ActivatedRoute)
    queryParamsDefault = {
                         presLevel: '10',
                         monthYear: '01-2012', 
                         shapes: '[[-65,-5,-15,15]]',
                         grid: 'rgTempAnom', 
                         interpolateBool: 'false', 
                         colorScale: 'OrRd', 
                         inverseColorScale: 'false',
                         paramMode: 'false', 
                         param: 'anomaly', 
                         gridDomain: '[0,1]'
                       } 
  });

  it('should be created', () => {
    const service: QueryGridService = TestBed.get(QueryGridService);
    expect(service).toBeTruthy();
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

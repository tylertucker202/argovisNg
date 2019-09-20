import { TestBed, inject } from '@angular/core/testing';

import { CovarService } from './covar.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CovarService', () => {
  beforeEach(async() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule ],
    providers: [ CovarService ],
  }));

  it('should be created', () => {
    const service: CovarService = TestBed.get(CovarService);
    expect(service).toBeTruthy();
  });

  it('should have params', inject([CovarService], (service: CovarService) => {

    expect(service['proj']).toEqual('EPSG:3857')
    expect(service['forcastDays']).toEqual(60)
    //expect(service['dataUrl']).toBeTruthy()
    expect(service['lngLat']).toEqual([0, 0])
  }));

  it('should set map state', inject([CovarService], (service: CovarService) => {

    const testProj = 'testProj'
    const forcastDays = 140
    const testLngLat = [25, 25]
    const testDataUrl = '/covarGrid/25/25/140'

    service.setMapState('proj', testProj)
    service.setMapState('forcastDays', JSON.stringify(forcastDays))
    service.setMapState('lngLat', JSON.stringify(testLngLat))


    expect(service['proj']).toEqual(testProj)
    expect(service['forcastDays']).toEqual(forcastDays)
    expect(service['lngLat']).toEqual(testLngLat)

    service.buildDataUrl()
    expect(service.getDataUrl()).toEqual(testDataUrl)
    expect(service['dataUrl']).toEqual(testDataUrl)

  }));

});

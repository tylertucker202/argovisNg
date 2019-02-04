import { TestBed, inject } from '@angular/core/testing';

import { QueryService } from './query.service';

import { GeoJSON } from 'geojson'
import { geoJSON } from 'leaflet';

describe('QueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryService]
    });
  });

  it('should be created', inject([QueryService], (service: QueryService) => {
    expect(service).toBeTruthy();
  }));

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

    var geoFeatureArray = {
      type: "FeatureCollection",
      features:
      [{
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [[[-67.13734351262877, 45.137451890638886],
                [-66.96466, 44.8097],
                [-68.03252, 44.3252],
                [-69.06, 43.98],
                [-70.11617, 43.68405],
                [-70.64573401557249, 43.090083319667144],
                [-70.75102474636725, 43.08003225358635],
                [-70.79761105007827, 43.21973948828747],
                [-70.98176001655037, 43.36789581966826],
                [-70.94416541205806, 43.46633942318431],
                [-71.08482, 45.3052400000002],
                [-70.6600225491012, 45.46022288673396],
                [-70.30495378282376, 45.914794623389355],
                [-70.00014034695016, 46.69317088478567],
                [-69.23708614772835, 47.44777598732787],
                [-68.90478084987546, 47.184794623394396],
                [-68.23430497910454, 47.35462921812177],
                [-67.79035274928509, 47.066248887716995],
                [-67.79141211614706, 45.702585354182816],
                [-67.13734351262877, 45.137451890638886]]]
            }
        }]
      }
    service.sendShapeMessage(geoFeatureArray) // need to cast as GeoJSON.Feature[] object
  }));

  it('should be emit a change upon pressure change', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('presRange');
    });
    const presRange = [0, 2000]
    service.sendPresMessage(presRange)
  }));

  it('should be emit a change upon date change', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('date');
    });
    const dateRange = { start: "2018-09-14", end: "2018-09-28", label: 'test date range' }
    //service.sendDisplayDateMessage(dateRange)
  }));

  it('should be emit a change upon toggle change', inject([QueryService], (service: QueryService) => {
    service.change
    .subscribe(msg => {
       expect(msg).toEqual('realtime');
    });
    const toggleOn = true
    service.sendToggleMsg(toggleOn)
  }));
});

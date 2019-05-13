import { TestBed, inject } from '@angular/core/testing';
import { QueryService } from './query.service';

import "leaflet";
import "leaflet-draw";
import "proj4leaflet";

import * as L from "leaflet";
//import { geoJSON, GeoJSON } from 'leaflet';

import { RouterTestingModule } from '@angular/router/testing';
import { loadLContext } from '@angular/core/src/render3/discovery_utils';

describe('QueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryService],
      imports: [RouterTestingModule]
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

    const coords = [[-67.13734351262877, 45.137451890638886],
    [-66.96466, 44.8097],
    [-68.03252, 44.3252],
    [-67.79035274928509, 47.066248887716995],
    [-67.79141211614706, 45.702585354182816],
    [-67.13734351262877, 45.137451890638886]]

    let llc = []
    for(let idx in coords){
      llc.push(L.latLng(coords[idx][1], coords[idx][0]))
    }

    var gfa = new L.Polygon(llc)
    var geoFeatureArray = {
      type: "FeatureCollection",
      features:
      [gfa.toGeoJSON()]
      }
    
    const broadcastChange=true
    const toggleThreeDayOff=false
    service.sendShapeMessage(geoFeatureArray, broadcastChange, toggleThreeDayOff) // need to cast as GeoJSON.Feature[] object
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
       expect(msg).toEqual('three day display date');
    });
    const threeDayDisplayDate = "2018-09-14"
    service.sengGlobalDateMessage(threeDayDisplayDate)
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

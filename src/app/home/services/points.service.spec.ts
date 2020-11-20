import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpClientModule, HttpHandler } from '@angular/common/http';
import { PointsService } from './points.service';
import { MapService } from './map.service';
import { PopupCompileService } from './popup-compile.service';
import { ProfPopupComponent } from '../prof-popup/prof-popup.component';
import { ProfilePoints } from '../../models/profile-points';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PointsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('MapService', ['getValue']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [PointsService, HttpClient, HttpClientModule, HttpHandler, { provide: MapService, useValue: spy }, PopupCompileService, ProfPopupComponent]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([PointsService], (service: PointsService) => {
    expect(service).toBeTruthy();
  }));

  it('should have icons', inject([PointsService], (service: PointsService) => {
    expect(service.argoIcon).toBeTruthy();
    expect(service.argoIconBW).toBeTruthy();
    expect(service.platformIcon).toBeTruthy();
  }));

  it('should have init function', inject([PointsService], (service: PointsService) => {
    expect(service.init).toBeTruthy();
  }));

  it('should have icons', inject([PointsService], (service: PointsService) => {
    expect(service.argoIcon).toBeTruthy();
    expect(service.argoIconBW).toBeTruthy();
    expect(service.platformIcon).toBeTruthy();
  }));

  it('should have mock points', inject([PointsService], (service: PointsService) => {
    expect(service.mockPoints).toBeTruthy();
  }));

  it('should return mock points', inject([PointsService], (service: PointsService) => {

    service.get_mock_points()
    .subscribe((mockPoints: ProfilePoints[]) => {
      expect(mockPoints).toBeTruthy();
      expect(mockPoints[0]._id).toBeTruthy();
      expect(mockPoints[0].date).toBeTruthy();
      expect(mockPoints[0].cycle_number).toBeTruthy();
      expect(mockPoints[0].geoLocation).toBeTruthy();
      expect(mockPoints[0].platform_number).toBeTruthy();
      },
      error => {
        this.notifier.notify( 'error', 'error in getting mock profiles' )
      })
  }));

  it('should have wrap coordinates', inject([PointsService], (service: PointsService) => {
    expect(service['make_wrapped_lng_lat_coordinates']).toBeTruthy();

    const inT1 = [0, 0]
    const outT1 = service['make_wrapped_lng_lat_coordinates'](inT1)
    expect(outT1).toEqual([[0,0]])
    const inT2 = [100, 0]
    const outT2 = service['make_wrapped_lng_lat_coordinates'](inT2)
    expect(outT2).toEqual([inT2, [inT2[0] - 360, inT2[1]]])
    const inT3 = [-100, 0]
    const outT3 = service['make_wrapped_lng_lat_coordinates'](inT3)
    expect(outT3).toEqual([inT3, [inT3[0] + 360, inT3[1]]])
  }));

  it('should make coordinates', inject([PointsService], (service: PointsService) => {
    expect(service['make_lng_lat_coords']).toBeTruthy();
    const inT1 = [0, 0]
    const outT1 = service['make_lng_lat_coords'](inT1)
    expect(outT1).toEqual([[0,0]])
  }));

  it('should format LatLng coordinates', inject([PointsService], (service: PointsService) => {
    service.get_mock_points()
    .subscribe((mockPoints: ProfilePoints[]) => {
    const pointQ4 = mockPoints[0]
    const pointQ3 = mockPoints[1]
    const pointQ1 = mockPoints[2]
    console.log(mockPoints.length)
    const pointQ2 = mockPoints[3]
    const Q1LatLng = service.formatLatLng(pointQ1.geoLocation.coordinates)
    expect(Q1LatLng).toEqual([ "5.000 N", "4.740 E" ])
    const Q2LatLng = service.formatLatLng(pointQ2.geoLocation.coordinates)
    expect(Q2LatLng).toEqual([ "5.000 N", "32.787 W" ])
    const Q3LatLng = service.formatLatLng(pointQ3.geoLocation.coordinates)
    expect(Q3LatLng).toEqual([ "21.205 S", "32.787 W" ])
    const Q4LatLng = service.formatLatLng(pointQ4.geoLocation.coordinates)
    expect(Q4LatLng).toEqual([ "20.180 S", "4.740 E" ])
    },
    error => {
      this.notifier.notify( 'error', 'error in getting mock profiles' )
    })
  }));
});

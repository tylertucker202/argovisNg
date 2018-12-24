import { Injectable, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { ProfilePoints } from './models/profile-points'
import { MapService } from './map.service';
import * as L from 'leaflet';
import { PopupCompileService } from './popup-compile.service';
import { ProfPopupComponent } from './prof-popup/prof-popup.component';
import { Observable } from 'rxjs';
import { of } from 'rxjs';


@Injectable()
export class PointsService {

  public platformProfilesSelection: any;
  public appRef: ApplicationRef;

  constructor(public mapService: MapService,
              private http: HttpClient,
              private compileService: PopupCompileService) { }

  init(appRef: ApplicationRef): void {
    this.appRef = appRef;
    this.compileService.configure(this.appRef);
  }

  public argoIcon = L.icon({
    iconUrl: 'assets/img/dot_yellow.png',
    iconSize:     [12, 12], 
    iconAnchor:   [0, 0],
    popupAnchor:  [6, 6]
  });

  public platformIcon = L.icon({
      iconUrl: 'assets/img/dot_orange.png',
      iconSize:     [12, 12], 
      iconAnchor:   [0, 0],
      popupAnchor:  [6, 6]
  });

  public argoIconBW = L.icon({
      iconUrl: 'assets/img/dot_grey.png',
      iconSize:     [12, 12], 
      iconAnchor:   [0, 0],
      popupAnchor:  [6, 6]
  });

  public argoIconBGC = L.icon({
    iconUrl: 'assets/img/dot_green.png',
    iconSize:     [12, 12], 
    iconAnchor:   [0, 0],
    popupAnchor:  [6, 6]
});

public argoIconDeep = L.icon({
  iconUrl: 'assets/img/dot_blue.png',
  iconSize:     [12, 12], 
  iconAnchor:   [0, 0],
  popupAnchor:  [6, 6]
});

  public mockPoints:  ProfilePoints[] = 
  [{"_id":"6901549_169","date":"2018-07-09T20:43:00.000Z","cycle_number":169,"geoLocation":{"type":"Point","coordinates":[4.74,-20.18]},"platform_number":"6901549", "DATA_MODE":'D', 'containsBGC': true},
  {"_id":"3901520_100","date":"2018-07-09T16:37:32.999Z","cycle_number":100,"geoLocation":{"type":"Point","coordinates":[-32.7866,-21.2051]},"platform_number":"3901520", "DATA_MODE":'D'},
  {"_id":"6901549_170","date":"2018-07-09T20:43:00.000Z","cycle_number":170,"geoLocation":{"type":"Point","coordinates":[4.74,5.0000]},"platform_number":"6901549", "DATA_MODE":'D', 'isDeep': true},
  {"_id":"3901520_101","date":"2018-07-09T16:37:32.999Z","cycle_number":101,"geoLocation":{"type":"Point","coordinates":[-32.7866,5.0000]},"platform_number":"3901520", "DATA_MODE":'D'},
  {"_id":"3901503_136","date":"2018-07-09T15:37:12.999Z","cycle_number":136,"geoLocation":{"type":"Point","coordinates":[-31.6948,-35.3172]},"platform_number":"3901503", "DATA_MODE":'D', 'containsBGC': true},
  {"_id":"6901981_119","date":"2018-07-09T15:01:18.999Z","cycle_number":119,"geoLocation":{"type":"Point","coordinates":[-23.939999999999998,-23.881]},"platform_number":"6901981", "DATA_MODE":'R'},
  {"_id":"3902121_27","date":"2018-07-09T12:55:00.000Z","cycle_number":27,"geoLocation":{"type":"Point","coordinates":[-19.37458833333333,-23.396726666666666]},"platform_number":"3902121", "DATA_MODE":'A'},
  {"_id":"3902120_29","date":"2018-07-09T12:34:00.000Z","cycle_number":29,"geoLocation":{"type":"Point","coordinates":[-20.906981666666667,-24.33817833333333]},"platform_number":"3902120", "DATA_MODE":'R'},
  {"_id":"6902581_133","date":"2018-07-09T11:57:00.000Z","cycle_number":133,"geoLocation":{"type":"Point","coordinates":[-9.490999999999985,-28.809]},"platform_number":"6902581", "DATA_MODE":'A'},
  {"_id":"3901887_46","date":"2018-07-09T11:40:30.000Z","cycle_number":46,"geoLocation":{"type":"Point","coordinates":[-12.51845,-26.975236666666667]},"platform_number":"3901887", "DATA_MODE":'A'},
  {"_id":"6901684_127","date":"2018-07-09T06:45:00.000Z","cycle_number":127,"geoLocation":{"type":"Point","coordinates":[-2.687999999999988,-29.542]},"platform_number":"6901684", "DATA_MODE":'R'},
  {"_id":"1901732_108","date":"2018-07-09T04:43:19.000Z","cycle_number":108,"geoLocation":{"type":"Point","coordinates":[0.24943,-17.62164]},"platform_number":"1901732", "DATA_MODE":'R'},
  {"_id":"1901886_36","date":"2018-07-09T02:10:55.000Z","cycle_number":36,"geoLocation":{"type":"Point","coordinates":[0.1596,-31.7725]},"platform_number":"1901886", "DATA_MODE":'R', 'containsBGC': true, 'isDeep': true},
  {"_id":"5905141_55","date":"2018-07-08T23:23:15.002Z","cycle_number":55,"geoLocation":{"type":"Point","coordinates":[-28.427,-34.399]},"platform_number":"5905141", "DATA_MODE":'R'},
  {"_id":"1901298_208","date":"2018-07-08T18:21:52.000Z","cycle_number":208,"geoLocation":{"type":"Point","coordinates":[-21.8925,-23.157]},"platform_number":"1901298", "DATA_MODE":'R'},
  {"_id":"6901973_156","date":"2018-07-08T17:25:57.999Z","cycle_number":156,"geoLocation":{"type":"Point","coordinates":[-12.422000000000025,-32.747]},"platform_number":"6901973", "DATA_MODE":'R', 'containsBGC': true},
  {"_id":"3901110_107","date":"2018-07-08T16:58:26.001Z","cycle_number":107,"geoLocation":{"type":"Point","coordinates":[-27.48367,-24.22411]},"platform_number":"3901110", "DATA_MODE":'R'},
  ]

  public getMockPoints(): Observable<ProfilePoints[]> {
    return of(this.mockPoints)
  }

  public getSelectionPoints(urlQuery): Observable<ProfilePoints[]> {
    const url = urlQuery;
    return this.http.get<ProfilePoints[]>(url);
  }

  public getPlatformProfiles(platform: string): Observable<ProfilePoints[]> {
    const url = '/catalog/platforms/' + platform + '/map';
    return this.http.get<ProfilePoints[]>(url)
  }

  public getLatestProfiles(): Observable<ProfilePoints[]> {
    const url = '/selection/latestProfiles/map'
    return this.http.get<ProfilePoints[]>(url);
  }
  public getLastProfiles(): Observable<ProfilePoints[]> {
    const url = '/selection/lastProfiles/map';
    return this.http.get<ProfilePoints[]>(url);
  }

  public getLastThreeDaysProfiles(startDate: string): Observable<ProfilePoints[]> {
    let url = '/selection/lastThreeDays/';
    if (startDate) {
      url += startDate
    }
    return this.http.get<ProfilePoints[]>(url);
  }

  // plots the markers on the map three times. 
  public makeWrappedCoordinates(coordinates): number[][] {
      const lat = coordinates[1];
      const lon = coordinates[0];
      if (-90 > lon && lon > -180) {
          var coords = [[lon, lat], [lon + 360, lat]]
      }
      else if (90 < lon && lon < 180) {
          var coords = [[lon, lat], [lon - 360, lat]];
      }
      else{ var coords = [[lon, lat]]}
      return coords;
  };

  public makeCoords(coordinates) {
    const lat = coordinates[1];
    const lon = coordinates[0];    
    return [[lon, lat]]
  }

  public formatLatLng( lonLat : Number[]): String[] {
    const lat = Number(lonLat[1])
    const lng = Number(lonLat[0])
    if (lat > 0) {
      var strLat = Math.abs(lat).toFixed(3).toString() + ' N';
    }
    else {
        var strLat = Math.abs(lat).toFixed(3).toString() + ' S';
    }
    if (lng > 0) {
        var strLng = Math.abs(lng).toFixed(3).toString() + ' E';
    }
    else {
        var strLng = Math.abs(lng).toFixed(3).toString() + ' W';
    }

    return [strLat, strLng]
  }

  public addToMarkersLayer(this, profile, markersLayer, markerIcon=this.argoIcon, wrapCoordinates=true) {
    const selectedPlatform = profile.platform_number;
    const geoLocation = profile.geoLocation;
    const lat = geoLocation.coordinates[1].toFixed(2);
    const lon = geoLocation.coordinates[0].toFixed(2);
    const date = moment(profile.date).format('YYYY-MM-DD')
    const strLatLng = this.formatLatLng([lon, lat])
    const cycle = profile.cycle_number
    //for some reason _id looses its cycle number when passed to the popup object.
    // _id is made this way.
    let profile_id = profile.platform_number + '_' +  profile.cycle_number

    const dataMode = profile.DATA_MODE;
    const bgc = profile.containsBGC;
    const deep = profile.isDeep;
    if (profile.DIRECTION == 'D') {
      profile_id += 'D'
    }

    if (wrapCoordinates){
      var coordArray = this.makeWrappedCoordinates(geoLocation.coordinates);
    }
    else {
      var coordArray = this.makeCoords(geoLocation.coordinates);
    }

    for(let i = 0; i < coordArray.length; i++) {
        let marker;
        const coordinates = coordArray[i];
        marker = L.marker(coordinates.reverse(), {icon: markerIcon});
        marker.bindPopup(null);
        marker.on('click', (event) => {
          marker.setPopupContent(
                this.compileService.compile(ProfPopupComponent, (c) => 
                  { c.instance.param = profile_id; 
                    c.instance.profileId = profile_id;
                    c.instance.lat = strLatLng[0];
                    c.instance.lon = strLatLng[1];
                    c.instance.cycle = cycle;
                    c.instance.date = date;
                    c.instance.platform = selectedPlatform;
                    c.instance.dataMode = dataMode;
                    c.instance.bgc = bgc;
                    c.instance.deep = deep;
                  })
            );
});
        markersLayer.addLayer(marker);
    }
    return markersLayer;
};
}

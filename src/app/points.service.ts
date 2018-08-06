import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ProfilePoints } from './models/profile-points'
import { MapService } from './map.service';
import * as L from 'leaflet';

@Injectable()
export class PointsService {

  constructor(public mapService: MapService, private http: HttpClient) { }

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

  //close popups from all drawn items
  public closeDrawnItemPopups = function() {
    //close popups from all drawn items
    if (this.mapService.drawnItems){
        console.log('closing drawn items');
        this.mapService.drawnItems.eachLayer(function (layer) {
          layer.closePopup();
          });
      }    
    }

  //close popups from all drawn items
  public openDrawnItemPopups = function() {
    //close popups from all drawn items
    if (this.mapService.drawnItems){
        console.log('opening drawn items');
        this.mapService.drawnItems.eachLayer(function (layer) {
          layer.openPopup();
          });
      }    
    }

  private serverApi= 'http://argovis.com';

  private mockPoints:  ProfilePoints[] = 
  [{"_id":"6901549_169","date":"2018-07-09T20:43:00.000Z","cycle_number":169,"geoLocation":{"type":"Point","coordinates":[4.74,-20.18]},"platform_number":"6901549","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"3901520_100","date":"2018-07-09T16:37:32.999Z","cycle_number":100,"geoLocation":{"type":"Point","coordinates":[-32.7866,-21.2051]},"platform_number":"3901520","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"3901503_136","date":"2018-07-09T15:37:12.999Z","cycle_number":136,"geoLocation":{"type":"Point","coordinates":[-31.6948,-35.3172]},"platform_number":"3901503","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"6901981_119","date":"2018-07-09T15:01:18.999Z","cycle_number":119,"geoLocation":{"type":"Point","coordinates":[-23.939999999999998,-23.881]},"platform_number":"6901981","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"3902121_27","date":"2018-07-09T12:55:00.000Z","cycle_number":27,"geoLocation":{"type":"Point","coordinates":[-19.37458833333333,-23.396726666666666]},"platform_number":"3902121","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"3902120_29","date":"2018-07-09T12:34:00.000Z","cycle_number":29,"geoLocation":{"type":"Point","coordinates":[-20.906981666666667,-24.33817833333333]},"platform_number":"3902120","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"6902581_133","date":"2018-07-09T11:57:00.000Z","cycle_number":133,"geoLocation":{"type":"Point","coordinates":[-9.490999999999985,-28.809]},"platform_number":"6902581","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"3901887_46","date":"2018-07-09T11:40:30.000Z","cycle_number":46,"geoLocation":{"type":"Point","coordinates":[-12.51845,-26.975236666666667]},"platform_number":"3901887","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"6901684_127","date":"2018-07-09T06:45:00.000Z","cycle_number":127,"geoLocation":{"type":"Point","coordinates":[-2.687999999999988,-29.542]},"platform_number":"6901684","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"1901732_108","date":"2018-07-09T04:43:19.000Z","cycle_number":108,"geoLocation":{"type":"Point","coordinates":[0.24943,-17.62164]},"platform_number":"1901732","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"1901886_36","date":"2018-07-09T02:10:55.000Z","cycle_number":36,"geoLocation":{"type":"Point","coordinates":[0.1596,-31.7725]},"platform_number":"1901886","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"5905141_55","date":"2018-07-08T23:23:15.002Z","cycle_number":55,"geoLocation":{"type":"Point","coordinates":[-28.427,-34.399]},"platform_number":"5905141","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"1901298_208","date":"2018-07-08T18:21:52.000Z","cycle_number":208,"geoLocation":{"type":"Point","coordinates":[-21.8925,-23.157]},"platform_number":"1901298","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"6901973_156","date":"2018-07-08T17:25:57.999Z","cycle_number":156,"geoLocation":{"type":"Point","coordinates":[-12.422000000000025,-32.747]},"platform_number":"6901973","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"},
  {"_id":"3901110_107","date":"2018-07-08T16:58:26.001Z","cycle_number":107,"geoLocation":{"type":"Point","coordinates":[-27.48367,-24.22411]},"platform_number":"3901110","roundLat":"NaN","roundLon":"NaN","strLat":"NaN S","strLon":"NaN W"}
  ]

  public getMockPoints() {
    return this.mockPoints
  }

  public getSelectionPoints(urlQuery) {
    return this.http.get('/selection/profiles/map?'+urlQuery);
  }

  public getLatestProfiles() {
    return this.http.get('/selection/latestProfiles/map');
  }

  // plots the markers on the map three times. 
  private makeWrappedCoordinates(coordinates) {
      const lat = coordinates[1];
      const lon = coordinates[0];
      if (0 > lon && lon > -180) {
          var coords = [[lon, lat], [lon + 360, lat]]
      }
      else if (0 < lon && lon < 180) {
          var coords = [[lon, lat], [lon - 360, lat]];
      }
      else{ var coords = [[lon, lat]]}
      return coords;
  };

  private makeCoords(coordinates) {
    const lat = coordinates[1];
    const lon = coordinates[0];    
    return [[lon, lat]]
  }

  public addToMarkersLayer(this, profile, markersLayer, markerIcon=this.argoIcon, wrapCoordinates=true) {
    const selectedPlatform = profile.platform_number;
    const geoLocation = profile.geoLocation;
    var lat = geoLocation.coordinates[1].toFixed(2);
    var lon = geoLocation.coordinates[0].toFixed(2);
    if (lat > 0) {
        var strLat = Math.abs(lat).toFixed(3).toString() + ' N';
    }
    else {
        var strLat = Math.abs(lat).toFixed(3).toString() + ' S';
    }
    if (lon > 0) {
        var strLon = Math.abs(lon).toFixed(3).toString() + ' E';
    }
    else {
        var strLon = Math.abs(lon).toFixed(3).toString() + ' W';
    }
    const cycle = profile.cycle_number
    const profile_id = selectedPlatform.toString()+'_'+cycle.toString();
    if (wrapCoordinates){
      var coordArray = this.makeWrappedCoordinates(geoLocation.coordinates);
    }
    else {
      var coordArray = this.makeCoords(geoLocation.coordinates);
    }
    var profileLink = "<a href='/catalog/profiles/"+profile_id+"/page' target='_blank'> To profile page</a>";
    const platformButton = "<input type='button' value='Position history' onclick=platformProfilesSelection("+selectedPlatform.toString()+",'history')>"
    const platformLink = "<a href='/catalog/platforms/" + selectedPlatform + "/page' target='_blank' >To platform page</a>";
    const popupText = '<b>Hello, I\'m ' + profile_id + '!</b>'
                     + '<br>lon: ' + strLon + '</b>'
                     + '<br>lat: ' + strLat + '</b>'
                     + '<br>cycle: ' + cycle.toString() + '</b>'
                     + '<br>date: ' + moment(profile.date).format('YYYY-MM-DD') + '</b>'
                     + '<br>' + profileLink + '</b>'
                     + '<br>' + platformLink + '</b>'
                     + '<br>' + platformButton + '</b>'
    
    for(let i = 0; i < coordArray.length; i++) {
        let marker;
        const coordinates = coordArray[i];
        //const coordinates = geoLocation.coordinates;
        marker = L.marker(coordinates.reverse(), {icon: markerIcon}).bindPopup(popupText);
        markersLayer.addLayer(marker);
    }
};

}

import { StormPopupComponent } from './storm-popup/storm-popup.component';
import { PointsService } from '../home/services/points.service';
import { Injectable, ApplicationRef, Injector } from '@angular/core';
import * as moment from 'moment';
import { TcMapService } from './tc-map.service';
import * as L from 'leaflet';
import { Observable, of } from 'rxjs';
import { PopupCompileService } from '../home/services/popup-compile.service';
import { TcTrack, TcTrajTrack, TrajData } from '../models/tc-shape'
import { carlottaTraj, carlotta } from './tc-track.parameters'

@Injectable({
  providedIn: 'root'
})
export class TcTrackService extends PointsService {

  public platformProfilesSelection: any;
  public appRef: ApplicationRef;

  constructor(public injector: Injector) { super(injector) }

  init(appRef: ApplicationRef): void {
    this.appRef = appRef;
    this.compileService.configure(this.appRef);
  }

  public stormIcon = L.icon({
    iconUrl: 'assets/img/storm.png',
    iconSize:     [24, 24], 
    iconAnchor:   [12, 12],
    popupAnchor:  [0, 0]
  })

  public get_mock_tc(): Observable<TcTrack[]> {
    return of(carlotta);
  }

  public get_mock_tc_traj(): Observable<TcTrajTrack[]> {
    return of(carlottaTraj)
  }

  public get_tc_tracks(url=''): Observable<TcTrack[]> {
    return this.http.get<TcTrack[]>(url)
  }

  public get_tc_traj_tracks(url=''): Observable<TcTrajTrack[]> {
    return this.http.get<TcTrajTrack[]>(url)
  }

  public make_wrapped_latLngs(latLngs: number[][]): number[][][] {
    let wraps = []
    latLngs.forEach( (lat, lng) => {
      if (-90 > lng && lng > -180) { //duplicate to the right
        wraps.push(1)
      }
      else if (90 > lng && lng < 180) { //duplicate to the left
        wraps.push(-1)
      }
    })

    let wrappedLngLats = [latLngs]
    wraps.forEach( sign => {
      const wll = latLngs.map( x => [x[0], x[1] + 360 * sign])
      wrappedLngLats.push(wll)
    })

    return wrappedLngLats
  }

  public add_to_track_layer(track: TcTrack, trackLayer: L.LayerGroup): L.LayerGroup {
    let trajDataArr: TrajData[] = track['traj_data']
    const name = track['name']
    const source = track['source']
    let latLngs = []
    for (let idx=0; idx<trajDataArr.length; ++idx) {
      const trajData = trajDataArr[idx]
      const lat = trajData['lat']
      const lon = trajData['lon']
      latLngs.push([lat, lon])
      const date = moment(trajData['timestamp']).format('LLLL')
      const strLatLng = this.formatLatLng([lon, lat])
      const catagory = trajData['class']
      const geoLocation = trajData['geoLocation']
      const wind = trajData['wind']
      const pres = trajData['pres']

      const coordArray = this.make_wrapped_lng_lat_coordinates(geoLocation.coordinates);
      for(let jdx=0; jdx<coordArray.length; jdx++) {
        let marker;
        const latLngCoords = [coordArray[jdx][1], coordArray[jdx][0]] as [number, number]
        marker = L.marker(latLngCoords, {icon: this.stormIcon});
        marker.bindPopup(null);
        marker.on('click', (event) => {
          marker.setPopupContent(
                this.compileService.compile(StormPopupComponent, (c) => 
                  { c.instance.name = name
                    c.instance.source = source
                    c.instance.catagory = catagory
                    c.instance.lat = strLatLng[0]
                    c.instance.lon = strLatLng[1]
                    c.instance.date = date
                    c.instance.wind = wind
                    c.instance.pres = pres
                  })
            );
      })
      trackLayer.addLayer(marker);
      }

      const wrappedLatLngs = this.make_wrapped_latLngs(latLngs)
      for(let jdx = 0; jdx<wrappedLatLngs.length; jdx++){
        const pl = L.polyline(wrappedLatLngs[jdx] as L.LatLngExpression[])
        trackLayer.addLayer(pl)
      }
    }
    return trackLayer
  }

}

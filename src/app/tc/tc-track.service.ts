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

  public get_tc_tracks_by_date_range(startDate: moment.Moment, endDate: moment.Moment): Observable<TcTrack[]> {
    let url = `/tc/findByDateRange?startDate=${startDate.format('YYYY-MM-DDTHH:mm:ss')}&endDate=${endDate.format('YYYY-MM-DDTHH:mm:ss')}`
    return this.http.get<TcTrack[]>(url)
  }

  public get_tc_tracks_by_name_year(name: string, year: string): Observable<TcTrack[]> {
    let url = `/tc/findByNameYear?name=${name}&year=${year}`
    return this.http.get<TcTrack[]>(url)
  }

  public get_tc_traj_tracks(url=''): Observable<TcTrajTrack[]> {
    return this.http.get<TcTrajTrack[]>(url)
  }

  public get_storm_names(): Observable<string[]> {
    return this.http.get<string[]>('/tc/stormNameList')
  }

  public make_wrapped_latLngs(latLngs: number[][]): number[][][] {
    let wraps = new Set()
    latLngs.forEach( (lat, lng) => {
      if (-90 > lng && lng > -180) { //duplicate to the right
        wraps.add(1)
      }
      else if (90 > lng && lng < 180) { //duplicate to the left
        wraps.add(-1)
      }
    })

    let wrappedLngLats = [latLngs]
    wraps.forEach( (sign: number) => {
      const wll = latLngs.map( x => [x[0], x[1] + 360 * sign])
      wrappedLngLats.push(wll)
    })

    return wrappedLngLats
  }


  public anti_meridian_transform(latLngs: number[][]): number[][] {
    //if tc has lon range > 270, assume tc crosses antimeridian
    const lngs = latLngs.map( (latLng: number[]) => { return latLng[1]; });
    const lonMax = lngs.reduce((a, b) => Math.max(a, b))
    const lonMin = lngs.reduce((a, b) => Math.min(a, b))
    const lonRange = lonMax - lonMin
    if (lonRange > 270) {
      latLngs.forEach( (latLng: number[]) => {
        if (latLng[1] >= 0) {
          latLng[1] -= 360
        }
      })
    }
  
    return latLngs
  }

  public add_to_track_layer(track: TcTrack, trackLayer: L.LayerGroup): L.LayerGroup {
    let trajDataArr: TrajData[] = track['traj_data']
    let name = track['name']
    if (!name) {
      name = 'UNNAMED'
    }
    const source = track['source']
    let latLngs = []
    // console.log('storm name:', name)
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
    }
    latLngs = this.anti_meridian_transform(latLngs)
    const wrappedLatLngs = this.make_wrapped_latLngs(latLngs)
    for(let jdx = 0; jdx<wrappedLatLngs.length; jdx++){
      const pl = L.polyline(wrappedLatLngs[jdx] as L.LatLngExpression[])
      trackLayer.addLayer(pl)
    }
    return trackLayer
  }

}

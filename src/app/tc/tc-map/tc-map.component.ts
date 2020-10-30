import { Component, OnInit, Injector } from '@angular/core'
import { MapComponent } from './../../home/map/map.component'
import { TcQueryService } from './../tc-query.service'
import { TcMapService } from './../tc-map.service'
import { TcTrackService } from './../tc-track.service'
import { TcTrack, TcTrajTrack } from '../../models/tc-shape'
import { ProfilePoints } from '../../models/profile-points'

import * as L from "leaflet"
@Component({
  selector: 'app-tc-map',
  templateUrl: './tc-map.component.html',
  styleUrls: ['./tc-map.component.css']
})
export class TcMapComponent extends MapComponent implements OnInit {
  private tcQueryService: TcQueryService
  private tcMapService: TcMapService
  private tcTrackService: TcTrackService
  public trackLayer = L.layerGroup()
  constructor(public injector: Injector) { super(injector)
                                           this.tcQueryService = this.injector.get(TcQueryService)
                                           this.tcMapService = this.injector.get(TcMapService)
                                           this.tcTrackService = this.injector.get(TcTrackService)
                                         }

  ngOnInit() {
  this.pointsService.init(this.appRef)
  this.tcTrackService.init(this.appRef)
  this.tcMapService.init(this.appRef)
  this.set_params_and_events()
  this.proj = 'WM'
  this.wrapCoordinates = true
  this.set_points_on_map()
  this.set_mock_tc_tracks()
  this.invalidate_size()

  }

  public set_map(): void {
    this.map = this.tcMapService.generate_map(this.proj)
    this.startView = this.map.getCenter()
    this.startZoom = this.map.getZoom()

    this.tcMapService.coordDisplay.addTo(this.map)
    // this.tcMapService.tcTrackItems.addTo(this.map) //special shapes for ar objects
    this.tcMapService.scaleDisplay.addTo(this.map)
    this.trackLayer.addTo(this.map)
    this.markersLayer.addTo(this.map)  
  }

  public set_params_and_events(): void { //  rewritten function is called in super.ngOnInit()
    this.set_map()
    console.log('setting params from tc map component')
    this.tcQueryService.set_params_from_url()

    this.tcQueryService.change
      .subscribe(msg => {
        this.tcQueryService.set_url()
        this.markersLayer.clearLayers()
        this.set_points_on_map()
        })
    this.tcQueryService.clear_layers
      .subscribe( () => {
        this.tcQueryService.clear_shapes()
        this.markersLayer.clearLayers()
        this.tcMapService.tcTrackItems.clear_layers()
        this.tcQueryService.set_url()
      })
    this.tcQueryService.resetToStart
      .subscribe( () => {
        this.tcQueryService.clear_shapes()
        this.markersLayer.clearLayers()
        // this.tcMapService.drawnItems.clear_layers()
        this.tcMapService.tcTrackItems.clear_layers()
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
      })
    this.tcQueryService.tcEvent
    .subscribe( (msg: string) => {
      console.log('tcEvent emitted')
      const dateString = this.tcQueryService.format_date(this.tcQueryService.get_tc_date())
      const tcTracks = this.tcTrackService.get_tc_tracks(dateString)
      tcTracks.subscribe((tcTracks: TcTrack[]) => {
        if (tcTracks.length !== 0) {
          this.tcQueryService.set_selection_date_range() // for profiles
          this.set_tc_tracks(tcTracks)
        }
        else {
            this.notifier.notify( 'warning', 'no tc tracks found for date selected' )
        }
      })
    })
  }

  private set_mock_tc_tracks() {
    const tcTracks = this.tcTrackService.get_mock_tc()
    tcTracks.subscribe((tcTracks: TcTrack[]) => {
      this.set_tc_tracks(tcTracks)
    })
  }

  private set_tc_tracks(tcTracks: TcTrack[]) {

    for (let idx in tcTracks) {
      let track = tcTracks[idx]
      this.tcTrackService.add_to_track_layer(track, this.trackLayer)
    }
  }

  public display_profiles(profilePoints: ProfilePoints[], markerType: string): void {

    const includeRT = this.tcQueryService.get_realtime_toggle()
    const bgcOnly = this.tcQueryService.get_bgc_toggle()
    const deepOnly = this.tcQueryService.get_deep_toggle()

    for (let idx in profilePoints) {
      let profile = profilePoints[idx]
      let dataMode = profile.DATA_MODE
      if ( ( dataMode == 'R' || dataMode == 'A' ) && (includeRT == false) ) { continue }
      if ( !profile.containsBGC===true && bgcOnly) { continue } //be careful, old values may equal 1. use ==
      if ( !profile.isDeep===true && deepOnly ) { continue } // always use ===
      if (markerType==='history') {
        this.markersLayer = this.pointsService.add_to_markers_layer(profile, this.markersLayer, this.pointsService.argoIconBW, this.wrapCoordinates)
      }
      else if (markerType==='platform') {
        this.markersLayer = this.pointsService.add_to_markers_layer(profile, this.markersLayer, this.pointsService.platformIcon, this.wrapCoordinates)
      }
      else if (profile.containsBGC) {
        this.markersLayer = this.pointsService.add_to_markers_layer(profile, this.markersLayer, this.pointsService.argoIconBGC, this.wrapCoordinates)
      }
      else if (profile.isDeep) {
        this.markersLayer = this.pointsService.add_to_markers_layer(profile, this.markersLayer, this.pointsService.argoIconDeep, this.wrapCoordinates)
      }
      else {
        this.markersLayer = this.pointsService.add_to_markers_layer(profile, this.markersLayer, this.pointsService.argoIcon, this.wrapCoordinates)
      }
    }
    }

}

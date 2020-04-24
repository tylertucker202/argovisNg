import { Component, OnInit, Injector } from '@angular/core'
import { MapComponent } from './../../home/map/map.component'
import { ArQueryService } from './../ar-query.service'
import { ArMapService } from './../ar-map.service'
import { ProfilePoints } from './../../home/models/profile-points'
import * as L from "leaflet"
@Component({
  selector: 'app-ar-map',
  templateUrl: './ar-map.component.html',
  styleUrls: ['./ar-map.component.css']
})
export class ArMapComponent extends MapComponent implements OnInit {
  private arQueryService: ArQueryService
  private arMapService: ArMapService
  constructor(public injector: Injector) { super(injector)
                                           this.arQueryService = this.injector.get(ArQueryService)
                                           this.arMapService = this.injector.get(ArMapService)
                                         }

  ngOnInit() {
    this.pointsService.init(this.appRef)
    this.arMapService.init(this.appRef)
    this.setParamsAndEvents()
    this.proj = 'WM'
    this.wrapCoordinates = true
    this.setPointsOnMap()

    this.invalidateSize()
  }

  public setMap(): void {
    this.map = this.arMapService.generateMap(this.proj)
    this.startView = this.map.getCenter()
    this.startZoom = this.map.getZoom()

    this.arMapService.coordDisplay.addTo(this.map)
    this.arMapService.arShapeItems.addTo(this.map) //special shapes for ar objects
    this.arMapService.scaleDisplay.addTo(this.map)
    this.markersLayer.addTo(this.map)   
  }

  public setParamsAndEvents(): void { //  rewritten function is called in super.ngOnInit()
    this.setMap()
    console.log('setting params from ar map component')
    this.arQueryService.setParamsFromURL()

    this.arQueryService.change
      .subscribe(msg => {
        console.log('query changed in ar component: ' + msg)
        this.arQueryService.setURL()
        this.markersLayer.clearLayers()
        this.setPointsOnMap()
        })
    this.arQueryService.clearLayers
      .subscribe( () => {
        this.arQueryService.clearShapes()
        this.markersLayer.clearLayers()
        //this.arMapService.drawnItems.clearLayers()
        this.arMapService.arShapeItems.clearLayers()
        this.arQueryService.setURL()
      })
    this.arQueryService.resetToStart
      .subscribe( () => {
        this.arQueryService.clearShapes()
        this.markersLayer.clearLayers()
        this.arMapService.drawnItems.clearLayers()
        //this.arMapService.arShapeItems.clearLayers()
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
      })
  }
  
  public setPointsOnMap(sendNotification=true): void {
    let shapeArrays = this.arQueryService.getShapes()
    if (shapeArrays) {
      this.markersLayer.clearLayers()
      let base = '/selection/profiles/map'
      const daterange = this.arQueryService.getArDateAsDateRange()

      shapeArrays.forEach( (shape) => {
        const transformedShape = this.arMapService.getTransformedShape(shape)
        let urlQuery = base+'?startDate=' + daterange.startDate + '&endDate=' + daterange.endDate
        urlQuery += '&shape='+JSON.stringify(transformedShape)

        this.pointsService.getSelectionPoints(urlQuery)
            .subscribe((selectionPoints: ProfilePoints[]) => {
              if (selectionPoints.length == 0 && !this.arQueryService.getDisplayGlobally()) {
                this.notifier.notify( 'info', 'no profile points found inside a shape' )
              }
              else {
                this.displayProfiles(selectionPoints, 'normalMarker')
              }
              }, 
            error => {
              if (sendNotification) {this.notifier.notify( 'error', 'error in getting profiles in shape' )}
              console.log('error occured when selecting points: ', error)
            })      
        })
    }
    if (this.arQueryService.getDisplayGlobally()) {
      this.setGlobalProfiles()
    }
  }

  private setGlobalProfiles(): void {

    const dateRange = this.arQueryService.getArDateAsDateRange()
    this.pointsService.getGlobalMapProfiles(dateRange.startDate, dateRange.endDate)
      .subscribe((profilePoints: ProfilePoints[]) => {
        if (profilePoints.length == 0) {
          this.notifier.notify( 'warning', 'zero profile points returned' )
        }
        else {
          this.displayProfiles(profilePoints, 'normalMarker')
        }
        },
        error => {
          this.notifier.notify( 'error', 'error in getting last three day profiles' )
        })
}

  public displayProfiles = function(profilePoints, markerType): void {

    const includeRT = this.arQueryService.getRealtimeToggle()
    const bgcOnly = this.arQueryService.getBGCToggle()
    const deepOnly = this.arQueryService.getDeepToggle()

    for (let idx in profilePoints) {
      let profile = profilePoints[idx]
      let dataMode = profile.DATA_MODE
      if ( ( dataMode == 'R' || dataMode == 'A' ) && (includeRT == false) ) { continue }
      if ( !profile.containsBGC===true && bgcOnly) { continue } //be careful, old values may equal 1. use ==
      if ( !profile.isDeep===true && deepOnly ) { continue } // always use ===
      if (markerType==='history') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconBW, this.wrapCoordinates)
      }
      else if (markerType==='platform') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.platformIcon, this.wrapCoordinates)
      }
      else if (profile.containsBGC) {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconBGC, this.wrapCoordinates)
      }
      else if (profile.isDeep) {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconDeep, this.wrapCoordinates)
      }
      else {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.argoIcon, this.wrapCoordinates)
      }
    }
    }

}

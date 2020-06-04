import { Component, OnInit, Injector } from '@angular/core'
import { MapComponent } from './../../home/map/map.component'
import { ArQueryService } from './../ar-query.service'
import { ArMapService } from './../ar-map.service'
import { ArShapeService } from './../ar-shape.service'
import { ARShape } from '../../home/models/ar-shape'
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
  private arShapeService: ArShapeService
  constructor(public injector: Injector) { super(injector)
                                           this.arQueryService = this.injector.get(ArQueryService)
                                           this.arMapService = this.injector.get(ArMapService)
                                           this.arShapeService = this.injector.get(ArShapeService)
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
        this.arQueryService.setURL()
        this.markersLayer.clearLayers()
        this.setPointsOnMap()
        })
    this.arQueryService.clearLayers
      .subscribe( () => {
        this.arQueryService.clearShapes()
        this.markersLayer.clearLayers()
        this.arMapService.arShapeItems.clearLayers()
        this.arQueryService.setURL()
      })
    this.arQueryService.resetToStart
      .subscribe( () => {
        this.arQueryService.clearShapes()
        this.markersLayer.clearLayers()
        // this.arMapService.drawnItems.clearLayers()
        this.arMapService.arShapeItems.clearLayers()
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
      })
    this.arQueryService.arEvent
    .subscribe( (msg: string) => {
      console.log('arEvent emitted')
      const dateString = this.arQueryService.formatDate(this.arQueryService.getArDate())
      const arShapes = this.arShapeService.getArShapes(dateString)
      arShapes.subscribe((arShapes: ARShape[]) => {
        if (arShapes.length !== 0) {
          this.arQueryService.setSelectionDateRange() // for profiles
          this.setArShape(arShapes)
        }
        else {
            this.notifier.notify( 'warning', 'no ar shapes found for date selected' )
        }
      })
    })
  }
  
  private convertArShapesToshapeArraysAndIds(arShapes: ARShape[]) {
    let shapeArrays = []
    let shape_ids = []
    for(let idx=0; idx<arShapes.length; idx++){
      let sa = arShapes[idx].geoLocation.coordinates
      sa = sa.map(coord => ([coord[1], coord[0]]))
      const shape_id = arShapes[idx]._id
      shape_ids.push(shape_id)
      shapeArrays.push(sa)
    }
    return [shapeArrays, shape_ids]
  }

  private setArShape(arShapes: ARShape[]) {
    const [shapeArrays, shape_ids] = this.convertArShapesToshapeArraysAndIds(arShapes)
    const shapeFeatureGroup = this.arMapService.convertArrayToFeatureGroup(shapeArrays, this.arMapService.arShapeOptions)
    const shapeType = 'atmospheric river shape'

    let shapes = []
    let idx = 0
    shapeFeatureGroup.eachLayer( (layer: unknown) => {
      const polygon = layer as L.Polygon
      shapes.push([shape_ids[idx], polygon])
      idx += 1
    })
    for(let idx=0; idx<shapes.length; idx++){
      const shape_id = shapes[idx][0]
      const polygon = shapes[idx][1] as L.Polygon
      this.arMapService.arPopupWindowCreation(polygon, this.arMapService.arShapeItems, shapeType, shape_id)
    }
    this.arQueryService.sendArShapes(shapeArrays)
  }

  
  public setPointsOnMap(sendNotification=true): void {
    let shapeArrays = this.arQueryService.getShapes()
    const displayGlobally = this.arQueryService.getDisplayGlobally()
    if (shapeArrays && !displayGlobally) {
      this.setShapeProfiles(shapeArrays, sendNotification)
    }
    if (displayGlobally) {
      this.setGlobalProfiles()
    }
  }

  private setShapeProfiles(shapeArrays: number[][][], sendNotification=true): void { 
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

  public displayProfiles(profilePoints: ProfilePoints[], markerType: string): void {

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
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIcon, this.wrapCoordinates)
      }
    }
    }

}

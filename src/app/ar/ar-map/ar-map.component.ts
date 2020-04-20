import { Component, OnInit, Injector } from '@angular/core'
import { MapComponent } from './../../home/map/map.component'
import { ArQueryService } from './../ar-query.service'
import { ArMapService } from './../ar-map.service'
import { ProfilePoints } from './../../home/models/profile-points'

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

  ngOnInit(): void {
    super.ngOnInit()
    this.arMapService.arShapeItems.addTo(this.map) //special shapes for ar objects
    this.setParamsAndEvents()
    this.arQueryService.setParamsFromURL()
    this.invalidateSize()
    //sets starting profiles from URL. Default is no params
    setTimeout(() => {  // RTimeout required to prevent expressionchangedafterithasbeencheckederror.
      this.arAddShapesFromQueryService()
     })
    }

  public setParamsAndEvents(): void {

    this.arQueryService.arEvent
    .subscribe(msg => {
      console.log('ar event emit ' + msg)
      this.arMapService.arShapeItems.clearLayers()
      this.arAddShapesFromQueryService()
    })

    //can be overwritten in child components
    this.arQueryService.setParamsFromURL()
    this.arQueryService.change
      .subscribe(msg => {
        console.log('query changed: ' + msg)
        this.arQueryService.setURL()
        this.markersLayer.clearLayers()
        this.setPointsOnMap()
        const showThreeDay = this.arQueryService.getThreeDayToggle()
        if (showThreeDay) { this.addDisplayProfiles() }
        })

    this.arQueryService.clearLayers
      .subscribe( () => {
        this.arQueryService.clearShapes()
        this.markersLayer.clearLayers()
        this.arMapService.drawnItems.clearLayers()
        this.arMapService.arShapeItems.clearLayers()
        this.arQueryService.setURL()
      })
  
    this.arQueryService.resetToStart
      .subscribe( () => {
        this.arQueryService.clearShapes()
        this.markersLayer.clearLayers()
        this.arMapService.drawnItems.clearLayers()
        this.arMapService.arShapeItems.clearLayers()
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
      })

    this.arQueryService.displayPlatform
    .subscribe( platform => {
      this.markersLayer.clearLayers()
      this.arMapService.drawnItems.clearLayers()
      this.pointsService.getPlatformProfiles(platform)
        .subscribe((profilePoints: ProfilePoints[]) => {
          if (profilePoints.length > 0) {
            this.displayProfiles(profilePoints, 'platform')
            this.map.setView([this.startView.lat, this.startView.lng], 2.5)
          }
          else {
            if (platform.length >= 7){
              this.notifier.notify( 'warning', 'platform: '+platform+' not found' )
            }
          }
        },
        error => {
          this.notifier.notify( 'error', 'error in getting platform: '+platform+' profiles.' )
          })
    })
  }

  private arAddShapesFromQueryService(): void {
    let shapeArrays = this.arQueryService.getShapes()
    if (shapeArrays) {
      console.log('ar shape arrays', shapeArrays)
      const shapeFeatureGroup = this.arMapService.convertArrayToFeatureGroup(shapeArrays, this.arMapService.shapeOptions)
      shapeFeatureGroup.eachLayer( layer => {
        const polygon = layer as L.Polygon
        this.arMapService.popupWindowCreation(polygon, this.arMapService.drawnItems)
      })
    }
    const broadcast = true // set to true to set page initially
    const toggleThreeDayOff = false

    const drawnItems = this.arMapService.drawnItems.toGeoJSON().features
    const shape = this.arQueryService.getShapesFromFeatures(drawnItems)
    console.log('shape', shape)
    this.arQueryService.sendShape(shape, broadcast, toggleThreeDayOff)
  }
}

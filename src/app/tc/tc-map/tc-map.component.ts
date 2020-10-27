import { Component, OnInit, Injector } from '@angular/core'
import { MapComponent } from './../../home/map/map.component'
import { TcQueryService } from './../tc-query.service'
import { TcMapService } from './../tc-map.service'
import { TcShapeService } from './../tc-shape.service'
import { TcShape } from '../../models/tc-shape'
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
  private tcShapeService: TcShapeService
  constructor(public injector: Injector) { super(injector)
                                           this.tcQueryService = this.injector.get(TcQueryService)
                                           this.tcMapService = this.injector.get(TcMapService)
                                           this.tcShapeService = this.injector.get(TcShapeService)
                                         }

  ngOnInit() {
  this.pointsService.init(this.appRef)
  this.tcMapService.init(this.appRef)
  this.set_params_and_events()
  this.proj = 'WM'
  this.wrapCoordinates = true
  this.setPointsOnMap()

  this.invalidateSize()

  }

  public set_map(): void {
    this.map = this.tcMapService.generateMap(this.proj)
    this.startView = this.map.getCenter()
    this.startZoom = this.map.getZoom()

    this.tcMapService.coordDisplay.addTo(this.map)
    // this.tcMapService.tcShapeItems.addTo(this.map) //special shapes for ar objects
    this.tcMapService.scaleDisplay.addTo(this.map)
    this.markersLayer.addTo(this.map)   
  }

  public set_params_and_events(): void { //  rewritten function is called in super.ngOnInit()
    this.set_map()
    console.log('setting params from ar map component')
    this.tcQueryService.set_params_from_url()

    this.tcQueryService.change
      .subscribe(msg => {
        this.tcQueryService.set_url()
        this.markersLayer.clearLayers()
        this.setPointsOnMap()
        })
    this.tcQueryService.clear_layers
      .subscribe( () => {
        this.tcQueryService.clear_shapes()
        this.markersLayer.clearLayers()
        this.tcMapService.tcShapeItems.clear_layers()
        this.tcQueryService.set_url()
      })
    this.tcQueryService.resetToStart
      .subscribe( () => {
        this.tcQueryService.clear_shapes()
        this.markersLayer.clearLayers()
        // this.tcMapService.drawnItems.clear_layers()
        this.tcMapService.tcShapeItems.clear_layers()
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
      })
    this.tcQueryService.tcEvent
    .subscribe( (msg: string) => {
      console.log('tcEvent emitted')
      const dateString = this.tcQueryService.format_date(this.tcQueryService.get_tc_date())
      const tcShapes = this.tcShapeService.get_tc_shapes(dateString)
      tcShapes.subscribe((tcShapes: TcShape[]) => {
        if (tcShapes.length !== 0) {
          this.tcQueryService.set_selection_date_range() // for profiles
          this.set_tc_shapes(tcShapes)
        }
        else {
            this.notifier.notify( 'warning', 'no ar shapes found for date selected' )
        }
      })
    })
  }

  private set_tc_shapes(arShapes: TcShape[]) {

  }

}

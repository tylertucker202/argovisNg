import { Component, OnInit, OnDestroy, ApplicationRef } from '@angular/core';
import { MapState } from '../../../typeings/mapState';
import { MapService } from '../../home/services/map.service';
import { QueryGridService } from '../query-grid.service';
import { RasterService } from '../raster.service';
import { RasterGrid } from '../../home/models/raster-grid'
import { ActivatedRoute } from '@angular/router'

import * as L from "leaflet";


@Component({
  selector: 'app-map-grid',
  templateUrl: './map-grid.component.html',
  styleUrls: ['./map-grid.component.css']
})

export class MapGridComponent implements OnInit, OnDestroy {
  public map: L.Map;
  public gridLayers = L.layerGroup();
  public startView: L.LatLng;
  public startZoom: number;
  public graticule: any;
  private wrapCoordinates: boolean;
  public proj: string;
  public mapState: MapState;
  public shapeOptions: any;
  
  constructor(private appRef: ApplicationRef,
              public mapService: MapService,
              private route: ActivatedRoute,
              public rasterService: RasterService,
              private queryGridService: QueryGridService){ }

  ngOnInit() {

    //todo: put this chunk in queryService as a function and call it here.
    this.route.queryParams.subscribe(params => {
      this.mapState = params
      Object.keys(this.mapState).forEach(key => {
        this.queryGridService.setMapState(key, this.mapState[key])
      });
      this.queryGridService.urlBuild.emit('got state from map component')
    });

    this.queryGridService.change
      .subscribe(msg => {
         console.log('query changed: ' + msg);
         this.queryGridService.setURL()
         this.gridLayers.clearLayers();
         this.gridSelectionOnMap()
        })

    this.gridSelectionOnMap()

    this.rasterService.getMockGridRaster()
    .subscribe( (rasterGrids: RasterGrid[]) => {
      if (rasterGrids.length == 0) {
        console.log('warning: no grid')
      }
      else {
        this.addRasterGridsToMap(rasterGrids)
      }
      },
      error => {
        console.log('error in getting mock profiles' )
      })

    this.queryGridService.clearLayers
    .subscribe( () => {
      //this.queryGridService.clearShapes();
      this.gridLayers.clearLayers();
      this.mapService.drawnItems.clearLayers();
      this.queryGridService.setURL()
    })

    this.queryGridService.resetToStart
      .subscribe( () => {
        //this.queryGridService.clearShapes();
        this.gridLayers.clearLayers();
        this.mapService.drawnItems.clearLayers();
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
        //this.queryService.setURL()
      })

    this.mapService.init(this.appRef);

    this.proj = 'WM'
    if ( this.proj === 'WM' ){
      this.wrapCoordinates = true
    }

    this.map = this.mapService.generateMap(this.proj);
    this.startView = this.map.getCenter()
    this.startZoom = this.map.getZoom()

    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.gridDrawControl.addTo(this.map);
    this.gridLayers.addTo(this.map);

    this.map.on('draw:created', (event: any) => { //  had to make event any in order to deal with typings
      const layer = event.layer
      this.mapService.drawnItems.addLayer(layer); //show rectangles
      const shapes = this.mapService.drawnItems.toGeoJSON()
      const broadcastLayer = true
      this.queryGridService.sendShapeMessage(shapes, broadcastLayer)
     });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      const layers = event.layers;
      let myNewShape = this.mapService.drawnItems;
      layers.eachLayer(function(layer: any) {
        const layer_id = layer._leaflet_id
        myNewShape.removeLayer(layer)
      });
      this.mapService.drawnItems = myNewShape
      console.log(this.mapService.drawnItems.toGeoJSON())
     });
    this.invalidateSize();

  }

  ngOnDestroy() {
    this.map.off();
    this.map.remove();
  }

  private invalidateSize(this): void {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(true);
      },100);
    }
  }

  gridSelectionOnMap(): void {

    const fc = this.queryGridService.getShapes()
    const monthYear = this.queryGridService.getMonthYear()
    const pres = this.queryGridService.getPresLevel()
    console.log(fc)
    if (fc) {
      const bboxes = this.queryGridService.getBBoxes(fc)
      console.log(bboxes)
      bboxes.forEach( (bbox) => {
        const lonRange = [bbox[0], bbox[2]]
        const latRange = [bbox[1], bbox[3]]
        this.rasterService.getGridRasterProfiles(latRange, lonRange, monthYear.format('MM-YYYY'), pres)
        .subscribe( (rasterGrids: RasterGrid[]) => {
          if (rasterGrids.length == 0) {
            console.log('warning: no grid')
          }
          else {
            this.addRasterGridsToMap(rasterGrids)
          }
          },
          error => {
            console.log('error in getting mock profiles' )
          })
      })
    }

  }

  private addRasterGridsToMap(rasterGrids: RasterGrid[]): void {

    for( let idx in rasterGrids){
      let grid = rasterGrids[idx];
      this.gridLayers = this.rasterService.addToGridLayer(grid, this.gridLayers)
      this.gridLayers.eachLayer(function(layer: L.Layer | any) { // get around typescript not having _field as a property
        const field = layer._field
        const bbox = (({ xllCorner, yllCorner, xurCorner, yurCorner }) => ({ xllCorner, yllCorner, xurCorner, yurCorner }))(field);
      })
      console.log(this.gridLayers)
    }

  }

}
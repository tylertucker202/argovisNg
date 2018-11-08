import { Component, OnInit, OnDestroy, Inject, ApplicationRef } from '@angular/core';
import { MapService } from '../map.service';
import { PointsService } from '../points.service';
import { ProfilePoints } from '../models/profile-points';
import { QueryService } from '../query.service';
import { DOCUMENT } from '@angular/common';
import * as L from "leaflet";
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
  public map: L.Map;
  public markersLayer = L.layerGroup();
  public startView: any;
  public startZoom: number;
  private wrapCoordinates: boolean;
  public proj: string;
  private readonly notifier: NotifierService;
  
  constructor(private appRef: ApplicationRef,
              public mapService: MapService,
              public pointsService: PointsService,
              private queryService: QueryService,
              private notifierService: NotifierService,
              @Inject(DOCUMENT) private document: Document) { this.notifier = notifierService }

  ngOnInit() {
    this.pointsService.init(this.appRef);
    this.mapService.init(this.appRef);
    this.proj = this.document.location.search.split('?map=')[1];
    if (this.proj) {
      console.log(this.proj)
    }
    else {
      this.proj = 'WM'
    }

    if (this.proj == 'WM') {
      this.wrapCoordinates = true;
    }
    else {
      this.wrapCoordinates = false;
    }
    this.generateMap();
    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.drawControl.addTo(this.map);
    this.markersLayer.addTo(this.map);
    this.mapService.map = this.map;

    this.queryService.change
      .subscribe(msg => {
         console.log('query changed: ' + msg);
         this.markersLayer.clearLayers();
         this.shapeSelectionOnMap();
        },)

    //todo: don't clear history or platform profiles (but redo them)
    //define history layer, & platform profile layer and do logic here.


    this.queryService.clearLayers
      .subscribe( () => {
        this.queryService.clearShapes();
        this.markersLayer.clearLayers();
        this.mapService.drawnItems.clearLayers();
      })
    
    this.queryService.resetToStart
      .subscribe( () => {
        this.queryService.clearShapes();
        this.markersLayer.clearLayers();
        this.mapService.drawnItems.clearLayers();
        this.setStartingProfiles();
        this.map.setView([this.startView.latitude, this.startView.longitude], this.startZoom)
      })

      this.queryService.displayPlatform
      .subscribe( platform => {
        this.markersLayer.clearLayers();
        this.mapService.drawnItems.clearLayers();
        this.pointsService.getPlatformProfiles(platform)
          .subscribe((profilePoints: ProfilePoints[]) => {
            if (profilePoints.length > 0) {
              this.displayProfiles(profilePoints, 'platform')
            }
            else {
              if (platform.length >= 7){
                this.notifier.notify( 'warning', 'platform: '+platform+' not found' )
              }
            }
          },
          error => {
            this.notifier.notify( 'error', 'error in getting platform: '+platform+' profiles' )
           })
      })

    this.queryService.triggerPlatformDisplay
      .subscribe( platform => {
        this.pointsService.getPlatformProfiles(platform)
          .subscribe((profilePoints: ProfilePoints[]) => {
            this.displayProfiles(profilePoints, 'history')
          },
          error => { 
            this.notifier.notify( 'error', 'error in getting platform: '+platform+' profiles' )
           })
      })
    this.map.on('draw:created', (event: L.DrawEvents.Created) => {
      this.markersLayer.clearLayers();
      var layer = event.layer
      this.mapService.popupWindowCreation(layer, this.mapService.drawnItems);
      const drawnFeatureCollection = this.getDrawnShapes(this.mapService.drawnItems)
      this.queryService.sendShapeMessage(drawnFeatureCollection);
    });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      var layers = event.layers;
      let myNewShape = this.mapService.drawnItems;
      layers.eachLayer(function(layer: any) {
        const layer_id = layer._leaflet_id
        myNewShape.removeLayer(layer)
      });
      this.mapService.drawnItems = myNewShape
      const drawnFeatureCollection = this.getDrawnShapes(this.mapService.drawnItems)
      this.queryService.sendShapeMessage(drawnFeatureCollection);
      });
    this.setStartingProfiles();
    this.invalidateSize();
  }

  // drawnItems is actually a L.featureGroup(), but the typings don't exist for this.
  private getDrawnShapes(drawnItems: any): GeoJSON.FeatureCollection {
    return drawnItems.toGeoJSON()
  }

  ngOnDestroy() {
        this.map.off();
        this.map.remove();
        this.mapService.map.off();
        this.mapService.map.remove();
  }

  private setStartingProfiles(this) {
    this.pointsService.getLastProfiles()
    .subscribe((profilePoints: ProfilePoints[]) => {
      if (profilePoints.length == 0) {
        this.notifier.notify( 'warning', 'zero profile points returned' )
      }
      else {
        this.displayProfiles(profilePoints, 'normalMarker')
      }
      },
      error => {
        this.notifier.notify( 'error', 'error in getting latest profiles' )
        console.log(error)
      })
    }
  
  private setMockPoints(this): void {
    this.pointsService.getMockPoints()
    .subscribe((profilePoints: ProfilePoints[]) => {
      if (profilePoints.length == 0) {
        this.notifier.notify( 'warning', 'zero mock profile points returned' )
      }
      else {
        this.displayProfiles(profilePoints, 'normalMarker')
      }
      },
      error => {
        this.notifier.notify( 'error', 'error in getting mock profiles' )
        console.log(error)
      })
  }


  private generateMap(this): void {
    switch(this.proj) {
      case 'WM': {
        console.log('generating web mercator');
        this.createWebMercator();
        break;
      }
      case 'SSP': {
        console.log('generating south stereo');
        this.createSouthernStereographic();
        break;
      }
      case 'NSP': {
        console.log('generating north stereo');
        this.createNorthernStereographic();
        break;
      }
      default: {
        console.log('proj not found, using web mercator')
        this.createWebMercator();
        break;
      }
    }
  }

  private invalidateSize(this) {
    if (this.map) {
      setTimeout(() => {
        this.mapService.map.invalidateSize(true);
        this.map.invalidateSize(true);
      },100);
    }
  }

private displayProfiles = function(this, profilePoints, markerType) {

  const includeRT = this.queryService.getToggle()
  for (let idx in profilePoints) {
      let profile = profilePoints[idx];
      let dataMode = profile.DATA_MODE
      if ( ( dataMode == 'R' || dataMode == 'A' ) && (includeRT == false)) {
        continue;
      }
      if (markerType==='history') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconBW, this.wrapCoordinates);
      }
      else if (markerType==='platform') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.platformIcon, this.wrapCoordinates);
      }
      else {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.argoIcon, this.wrapCoordinates);
      }
  };
  //this.markersLayer.addTo(this.map);
  };

private createWebMercator(this) {
  this.startView = { latitude: 20, longitude: -150 }
  this.startZoom = 3
  this.map = L.map('map',
                    {maxZoom: 13,
                    minZoom: 1,
                    zoomDelta: 0.25,
                    zoomSnap: 0,
                    zoomControl: false,
                    maxBounds: [[-180, -270], [180,180]],
                    layers: [this.mapService.baseMaps.ocean]})
                    .setView([this.startView.latitude, this.startView.longitude], this.startZoom );
  L.control.layers(this.mapService.baseMaps).addTo(this.map);
  L.control.zoom({position:'topleft'}).addTo(this.map);
  this.mapService.graticule.addTo(this.map);
};

private createSouthernStereographic(this) {
  this.startView = { latitude: -89, longitude: .1 }
  this.startZoom = 4
  this.map = L.map('map',
                  {maxZoom: 13,
                    minZoom: 3,
                    zoomDelta: 0.25,
                    zoomSnap: 0,
                    zoomControl: false,
                    //maxBounds: [[-1080, -1080], [1080,1080]],
                    crs: this.mapService.sStereo})
                    .setView([this.startView.latitude, this.startView.longitude], this.startZoom);    
  this.mapService.geojsonLayer.addTo(this.map);
  L.control.zoom({position:'topleft'}).addTo(this.map);
  //this.mapService.curvedGraticule.bringToFront().addTo(this.map);
};

private createNorthernStereographic(this) {
  this.startView =  { latitude: 89, longitude: .1 }
  this.startZoom = 4
  this.map = L.map('map',
                  {maxZoom: 13,
                    minZoom: 3,
                    zoomDelta: 0.25,
                    zoomSnap: 0,
                    zoomControl: false,
                    //maxBounds: [[-1080, -1080], [1080,1080]],
                    crs: this.mapService.nStereo})
                    .setView([this.startView.latitude, this.startView.longitude], this.startZoom);
  this.mapService.geojsonLayerNoAntartica.addTo(this.map);
  L.control.zoom({position:'topleft'}).addTo(this.map);
  //this.mapService.curvedGraticule.bringToFront().addTo(this.map);
};

shapeSelectionOnMap(): void {
  // Extract GeoJson from featureGroup
  let features = this.queryService.getShapes();
  if (features) {
      this.markersLayer.clearLayers();
      let base = '/selection/profiles/map'
      let dates = this.queryService.getDates();
      let presRange = this.queryService.getPresRange();
      let includeRealtime = this.queryService.getToggle();
      for (let i = 0; i < features.length; i++) {
          let shape = features[i].geometry.coordinates;
          const transformedShape = this.mapService.getTransformedShape(shape)
          let urlQuery = base+'?startDate=' + dates.start + '&endDate=' + dates.end +
                         '&presRange='+JSON.stringify(presRange) +
                         '&shape='+JSON.stringify(transformedShape) 
                         '&includeRT='+JSON.stringify(includeRealtime);
          console.log(urlQuery);
          this.pointsService.getSelectionPoints(urlQuery)
              .subscribe((selectionPoints: ProfilePoints[]) => {
                this.displayProfiles(selectionPoints, 'normalMarker');
                if (selectionPoints.length == 0) {
                  this.notifier.notify( 'warning', 'no profile points found in shape' )
                  console.log('no points returned in shape')
                }
                }, 
             error => {
              this.notifier.notify( 'error', 'error in getting profiles in shape' )
               console.log('error occured when selecting points')
               console.log(error)
             });
      }
  }
}
}
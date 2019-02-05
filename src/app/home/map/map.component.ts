import { Component, OnInit, OnDestroy, Inject, ApplicationRef } from '@angular/core';
import { MapService } from '../services/map.service';
import { PointsService } from '../services/points.service';
import { ProfilePoints } from '../models/profile-points';
import { QueryService } from '../services/query.service';
import { MapState } from '../../../typeings/mapState';
import { DOCUMENT } from '@angular/common';
import * as L from "leaflet";
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router'

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
  public graticule: any;
  private wrapCoordinates: boolean;
  public proj: string;
  private readonly notifier: NotifierService;
  public mapState: MapState;
  
  constructor(private appRef: ApplicationRef,
              public mapService: MapService,
              public pointsService: PointsService,
              private queryService: QueryService,
              private notifierService: NotifierService,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document) { this.notifier = notifierService }

  ngOnInit() {
    this.pointsService.init(this.appRef);
    this.mapService.init(this.appRef);

    this.route.queryParams.subscribe(params => {
      this.mapState = params
      Object.keys(this.mapState).forEach(key => {
        this.queryService.setMapState(key, this.mapState[key])
      });
      this.queryService.urlBuild.emit('got state from map component')
    });

    this.proj = this.queryService.getProj()

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
         this.queryService.setURL()
         this.markersLayer.clearLayers();
         this.shapeSelectionOnMap();
         const showThreeDay = this.queryService.getThreeDayToggle()
         if (showThreeDay) {
            this.addDisplayProfiles()
         }
         //this.setMockPoints()
        },)

    //todo: don't clear history or platform profiles (but redo them)
    //define history layer, & platform profile layer and do logic here.

    this.queryService.clearLayers
      .subscribe( () => {
        this.queryService.clearShapes();
        this.markersLayer.clearLayers();
        this.mapService.drawnItems.clearLayers();
        this.queryService.setURL()
      })
    
    this.queryService.resetToStart
      .subscribe( () => {
        this.queryService.clearShapes();
        this.markersLayer.clearLayers();
        this.mapService.drawnItems.clearLayers();
        this.setStartingProfiles();
        //this.setMockPoints()
        this.map.setView([this.startView.latitude, this.startView.longitude], this.startZoom)
        this.queryService.setURL()
      })

    this.queryService.displayPlatform
    .subscribe( platform => {
      this.markersLayer.clearLayers();
      this.mapService.drawnItems.clearLayers();
      this.pointsService.getPlatformProfiles(platform)
        .subscribe((profilePoints: ProfilePoints[]) => {
          if (profilePoints.length > 0) {
            this.displayProfiles(profilePoints, 'platform')
            this.map.setView([this.startView.latitude, this.startView.longitude], 2.5)
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
      const layer = event.layer
      this.mapService.popupWindowCreation(layer, this.mapService.drawnItems);
      //const drawnFeatureCollection = this.getDrawnShapes(this.mapService.drawnItems)
      this.queryService.sendShapeMessage(this.mapService.drawnItems.toGeoJSON(), true);
    });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      const layers = event.layers;
      let myNewShape = this.mapService.drawnItems;
      layers.eachLayer(function(layer: any) {
        const layer_id = layer._leaflet_id
        myNewShape.removeLayer(layer)
      });
      this.mapService.drawnItems = myNewShape
      //const drawnFeatureCollection = this.getDrawnShapes(this.mapService.drawnItems)
      this.queryService.sendShapeMessage(this.mapService.drawnItems.toGeoJSON(), true);
    });

    this.setStartingProfiles();
    this.invalidateSize();
    setTimeout(() => {  // RTimeout required to prevent expressionchangedafterithasbeencheckederror.
      this.addShapesFromURL();
     });
  }

  // drawnItems is actually a L.featureGroup(), but the typings don't exist
  private getDrawnShapes(drawnItems: any): GeoJSON.FeatureCollection {
    return drawnItems.toGeoJSON()
  }

  ngOnDestroy() {
    this.map.off();
    this.map.remove();
    this.mapService.map.off();
    this.mapService.map.remove();
  }

  private addShapesFromURL(): void {
    let featureCollection = this.queryService.getShapes()
    const options =  {color: '#983fb2',
                      weight: 4,
                      opacity: .5}

    if (featureCollection) {
      const features = featureCollection.features
      features.forEach( feature => {
        let coords = []
        feature.geometry.coordinates[0].forEach( (coord) => {
          const reverseCoord = [coord[1], coord[0]] // don't use reverse(), as it changes value in place
          coords.push(reverseCoord)
        })
        const polygonCoords = coords
        let polygon = L.polygon(polygonCoords, options)
        this.mapService.popupWindowCreation(polygon, this.mapService.drawnItems);
      });
    }
    this.queryService.sendShapeMessage(this.mapService.drawnItems.toGeoJSON(), true);
  }

  private setStartingProfiles(this) {
    this.pointsService.getLastThreeDaysProfiles()
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

    private addDisplayProfiles(this) {
      if (!this.queryService.getThreeDayToggle()) {return}
      const startDate = this.queryService.getDisplayDate()
      this.pointsService.getLastThreeDaysProfiles(startDate)
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
      })
  }

  private generateMap(this): void {
    switch(this.proj) {
      case 'WM': {
        this.wrapCoordinates = true
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
        this.wrapCoordinates = true
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

  const includeRT = this.queryService.getRealtimeToggle()
  const bgcOnly = this.queryService.getBGCToggle()
  const deepOnly = this.queryService.getDeepToggle()

  for (let idx in profilePoints) {
      let profile = profilePoints[idx];
      let dataMode = profile.DATA_MODE
      if ( ( dataMode == 'R' || dataMode == 'A' ) && (includeRT == false) ) { continue; }
      if ( !profile.containsBGC===true && bgcOnly) { continue; } //be careful, old values may equal 1. use ==
      if ( !profile.isDeep===true && deepOnly ) { continue; } // always use ===
      if (markerType==='history') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconBW, this.wrapCoordinates);
      }
      else if (markerType==='platform') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.platformIcon, this.wrapCoordinates);
      }
      else if (profile.containsBGC) {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconBGC, this.wrapCoordinates);
      }
      else if (profile.isDeep) {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconDeep, this.wrapCoordinates);
      }
      else {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.argoIcon, this.wrapCoordinates);
      }
  };
  //this.markersLayer.addTo(this.map);
  };

private getGraticule(basemapName: string) {
  switch(basemapName) {
    case 'esri': {
      return (this.mapService.graticuleLight)
      break;
    }
    case 'ocean': {
      return (this.mapService.graticuleDark)
      break;
    }
    case 'google': {
      return (this.mapService.graticuleLight)
      break;
    }
    default: {
      return (this.mapService.graticuleLight)
      break;
    }
  }
}

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
  this.map.on('baselayerchange', (e: any) => {
    this.map.removeLayer(this.graticule)
    this.graticule = this.getGraticule(e.name)
    this.graticule.addTo(this.map);
  });
  L.control.zoom({position:'topleft'}).addTo(this.map);
  this.graticule = this.getGraticule('ocean')
  this.graticule.addTo(this.map);
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
  let featureCollection = this.queryService.getShapes();
  if (featureCollection) {
    this.markersLayer.clearLayers();
    let base = '/selection/profiles/map'
    let dates = this.queryService.getSelectionDates();
    let presRange = this.queryService.getPresRange();
    let includeRealtime = this.queryService.getRealtimeToggle();
    let onlyBGC = this.queryService.getBGCToggle();
    let features = featureCollection.features
    features.forEach( (feature) => {
      let shape = feature.geometry.coordinates;
      const transformedShape = this.mapService.getTransformedShape(shape)
      let urlQuery = base+'?startDate=' + dates.start + '&endDate=' + dates.end
      if (presRange) {
        urlQuery += '&presRange='+JSON.stringify(presRange)
      }
      urlQuery += '&shape='+JSON.stringify(transformedShape)
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
      })
  }
}
}
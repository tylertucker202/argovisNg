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
  public startView: L.LatLng;
  public startZoom: number;
  public graticule: any;
  private wrapCoordinates: boolean;
  public proj: string;
  private readonly notifier: NotifierService;
  public mapState: MapState;
  public shapeOptions: any;
  
  constructor(private appRef: ApplicationRef,
              public mapService: MapService,
              public pointsService: PointsService,
              private queryService: QueryService,
              private notifierService: NotifierService,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document) { this.notifier = notifierService }

  ngOnInit() {
    this.shapeOptions =  {color: '#983fb2',
                    weight: 4,
                    opacity: .5}
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
    if ( this.proj === 'WM' ){
      this.wrapCoordinates = true
    }

    this.map = this.mapService.generateMap(this.proj);
    this.startView = this.map.getCenter()
    this.startZoom = this.map.getZoom()

    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.drawControl.addTo(this.map);
    this.markersLayer.addTo(this.map);

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
        this.map.setView([this.startView.lat, this.startView.lng], this.startZoom)
        //this.queryService.setURL()
      })

    this.queryService.displayPlatform
    .subscribe( platform => {
      this.markersLayer.clearLayers();
      this.mapService.drawnItems.clearLayers();
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
      const broadcast = true
      const toggleThreeDayOff = true

      const drawnItems = this.mapService.drawnItems.toGeoJSON().features
      const shape = this.queryService.getShapesFromFeatures(drawnItems)
      this.queryService.sendShapeMessage(shape, broadcast, toggleThreeDayOff);
    });

    this.map.on('draw:deleted', (event: L.DrawEvents.Deleted) => {
      const layers = event.layers;
      let myNewShape = this.mapService.drawnItems;
      layers.eachLayer(function(layer: any) {
        const layer_id = layer._leaflet_id
        myNewShape.removeLayer(layer)
      });
      this.mapService.drawnItems = myNewShape
      const broadcast = true
      const toggleThreeDayOff = false

      const drawnItems = this.mapService.drawnItems.toGeoJSON().features
      const shape = this.queryService.getShapesFromFeatures(drawnItems)
      this.queryService.sendShapeMessage(shape, broadcast, toggleThreeDayOff);
    });

    this.setStartingProfiles();
    this.invalidateSize();
    setTimeout(() => {  // RTimeout required to prevent expressionchangedafterithasbeencheckederror.
      this.addShapesFromURL();
     });
  }

  ngOnDestroy() {
    this.map.off();
    this.map.remove();
  }

  public convertArrayToFeatureGroup(shapeArrays: number[][][]): L.FeatureGroup {
  let shapes = L.featureGroup()
  shapeArrays.forEach( (array) => {
    let coords = []
    array.forEach(coord => {
      coords.push(L.latLng(coord[0], coord[1]))
    })
    const polygon = L.polygon(coords, this.shapeOptions)
    shapes.addLayer(polygon)
  })
  return(shapes)
  }

  private addShapesFromURL(): void {
    let shapeArrays = this.queryService.getShapes()
    if (shapeArrays) {
      const shapes = this.convertArrayToFeatureGroup(shapeArrays)
      //const features = shapes.eachLayer()
      shapes.eachLayer( layer => {
        console.log(layer)
        const polygon = layer
        this.mapService.popupWindowCreation(polygon, this.mapService.drawnItems);
      });
    }
    const broadcast = true
    const toggleThreeDayOff = false

    const drawnItems = this.mapService.drawnItems.toGeoJSON().features
    const shape = this.queryService.getShapesFromFeatures(drawnItems)
    this.queryService.sendShapeMessage(shape, broadcast, toggleThreeDayOff);
  }

  private setStartingProfiles(this): void {

    if (this.queryService.getThreeDayToggle()){
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
    }}

    private addDisplayProfiles(this): void {
      if (!this.queryService.getThreeDayToggle()) {return}
      const startDate = this.queryService.getGlobalDisplayDate()
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

  private invalidateSize(this): void {
    if (this.map) {
      setTimeout(() => {
        this.map.invalidateSize(true);
      },100);
    }
  }

private displayProfiles = function(this, profilePoints, markerType): void {

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
  };


shapeSelectionOnMap(): void {
  // Extract GeoJson from featureGroup
  let shapeArrays = this.queryService.getShapes();

  
  if (shapeArrays) {
    this.markersLayer.clearLayers();
    let base = '/selection/profiles/map'
    let dates = this.queryService.getSelectionDates();
    let presRange = this.queryService.getPresRange();
    let includeRealtime = this.queryService.getRealtimeToggle();
    let onlyBGC = this.queryService.getBGCToggle();

    shapeArrays.forEach( (shape) => {
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
            console.log('error occured when selecting points: ', error)
          });      
      })
  }
}
}
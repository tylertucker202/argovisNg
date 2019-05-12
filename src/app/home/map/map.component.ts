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
    if ( this.proj === 'WM' ){
      this.wrapCoordinates = true
    }

    this.map = this.mapService.generateMap(this.proj);
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
      const broadcast = true
      const toggleThreeDayOff = true
      this.queryService.sendShapeMessage(this.mapService.drawnItems.toGeoJSON(), broadcast, toggleThreeDayOff);
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
      const broadcast = true
      const toggleThreeDayOff = false
      this.queryService.sendShapeMessage(this.mapService.drawnItems.toGeoJSON(), broadcast, toggleThreeDayOff);
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
    const broadcast = true
    const toggleThreeDayOff = false
    this.queryService.sendShapeMessage(this.mapService.drawnItems.toGeoJSON(), broadcast, toggleThreeDayOff);
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
            console.log('error occured when selecting points: ', error)
          });      
      })
  }
}
}
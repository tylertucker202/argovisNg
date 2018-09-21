import { Component, OnInit, OnDestroy, Inject, ApplicationRef } from '@angular/core';
import { MapService } from '../map.service';
import { PointsService } from '../points.service'
import { ProfilePoints } from '../models/profile-points';
import { QueryService } from '../query.service';
import { DOCUMENT } from '@angular/common';
import * as L from "leaflet";

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
  private proj: string;
  constructor(private appRef: ApplicationRef,
              public mapService: MapService,
              public pointsService: PointsService,
              private queryService: QueryService,
              @Inject(DOCUMENT) private document: Document) {}

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
    this.generateMap();
    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.drawControl.addTo(this.map);
    this.mapService.map = this.map;

    this.queryService.change
      .subscribe(msg => {
         console.log('query changed: ' + msg);
         this.shapeSelectionOnMap();
        },)

    this.queryService.clearLayers
      .subscribe( () => {
        this.markersLayer.clearLayers();
        this.mapService.drawnItems.clearLayers();
      })
    
    this.queryService.resetToStart
      .subscribe( () => {
        this.markersLayer.clearLayers();
        this.mapService.drawnItems.clearLayers();
        this.setStartingProfiles();
        this.map.setView([this.startView.latitude, this.startView.longitude], this.startZoom)
      })

    this.queryService.triggerPlatformDisplay
      .subscribe( platform => {
        this.pointsService.getPlatformProfiles(platform)
          .subscribe((profilePoints: ProfilePoints[]) => {
            this.displayProfiles(profilePoints, 'history')
          },
          error => { console.log('error in getting platformProfiles') })
      })
    this.map.on('draw:created', (event: L.DrawEvents.Created) => {
      var layer = event.layer
      this.mapService.popupWindowCreation(layer, this.mapService.drawnItems);
      this.queryService.sendShapeMessage(this.mapService.drawnItems);
    });

    this.setStartingProfiles();
    this.invalidateSize();
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
        console.log('zero profile points returned')
      }
      else {
        this.displayProfiles(profilePoints, 'normalMarker')
      }
      },
      error => {console.log('error in getting latest profiles')})
  this.displayProfiles(this.pointsService.getMockPoints(), 'normalMarker')
  }


  private generateMap(this) {
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
  if (this.mProj == 'Web Mercator') {
    this.wrapCoordinates = true;
  }
  else {
    this.wrapCoordinates = false;
  }

  for (let idx in profilePoints) {
      //console.log('myprofile')
      let profile = profilePoints[idx];
      //console.log(profile)
      if (markerType==='history') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconBW, this.wrapCoordinates);
          //this.pointsService.openDrawnItemPopups();
      }
      else if (markerType==='platform') {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.platformIcon, this.wrapCoordinates);
          //this.pointsService.openDrawnItemPopups();
      }
      else {
        this.markersLayer = this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.argoIcon, this.wrapCoordinates);
          //this.pointsService.openDrawnItemPopups();
      }
  };
  this.markersLayer.addTo(this.map);
  };

private createWebMercator(this) {
  this.startView = { latitude: 0, longitude: -30 }
  this.startZoom = 3
  this.map = L.map('map',
                    {maxZoom: 13,
                    minZoom: 1,
                    zoomDelta: 0.25,
                    zoomSnap: 0,
                    zoomControl: false,
                    maxBounds: [[-180, -270], [180,270]],
                    layers: [this.mapService.baseMaps.ocean]})
                    .setView([this.startView.latitude, this.startView.longitude], this.startZoom );
  L.control.layers(this.mapService.baseMaps).addTo(this.map);
  L.control.zoom({position:'topleft'}).addTo(this.map);
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
  this.mapService.geojsonLayer.addTo(this.map);
  L.control.zoom({position:'topleft'}).addTo(this.map);
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
                         '&shape='+JSON.stringify([transformedShape])
                         //'&includeRT='+JSON.stringify(includeRealtime);
          console.log(urlQuery);
          this.pointsService.getSelectionPoints(urlQuery)
              .subscribe((selectionPoints: ProfilePoints[]) => {
                this.displayProfiles(selectionPoints, 'normalMarker');
                if (selectionPoints.length == 0) {
                  console.log('no points returned in shape')
                }
                }, 
             error => {
               console.log('error occured when selecting points')
             });
      }
  }
}
}
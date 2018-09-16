import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../map.service';
import { PointsService } from '../points.service'
import { ProfilePoints } from '../models/profile-points';
import { QueryService } from '../query.service';
import * as L from "leaflet";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
  @Input() mProj: string;
  public map: L.Map;
  public profilePoints: ProfilePoints[];
  public platformProfileMarkersLayer = L.layerGroup();
  public markersLayer = L.layerGroup();
  public drawnItems = L.layerGroup();
  private wrapCoordinates: boolean;
  constructor(public mapService: MapService, public pointsService: PointsService, private queryService: QueryService) {}

  ngOnInit() {
    this.profilePoints = this.pointsService.getMockPoints();
    this.generateMap();
    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.drawControl.addTo(this.map);
    this.mapService.map = this.map;

    this.queryService.change
      .subscribe(msg => {
         console.log('query profiles: '+msg);
         this.shapeSelectionOnMap();
        })
    this.map.on('draw:created', (event: L.DrawEvents.Created) => {
      var layer = event.layer
      this.mapService.popupWindowCreation(layer, this.mapService.drawnItems);
      this.queryService.sendShapeMessage(this.mapService.drawnItems);
    });
    //console.log(this.profilePoints)
    // this.pointsService.getLatestProfiles()
    //   .subscribe((data: ProfilePoints[]) => 
    //     {this.profilePoints = data});
    //   console.log(this.profilePoints)
    this.displayProfiles('normalMarker');
    this.invalidateSize();
  }

  ngOnDestroy() {
        this.map.off();
        this.map.remove();
        this.mapService.map.off();
        this.mapService.map.remove();
  }


  private generateMap(this) {
    switch(this.mProj) {
      case 'Web Mercator': {
        console.log('generating web mercator');
        this.createWebMercator();
        break;
      }
      case 'Southern Stereographic': {
        console.log('generating south stereo');
        this.createSouthernStereographic();
        break;
      }
      case 'Northern Stereographic': {
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

private displayProfiles = function(this, markerType) {
  if (this.mProj == 'Web Mercator') {
    this.wrapCoordinates = true;
  }
  else {
    this.wrapCoordinates = false;
  }

  for (let idx in this.profilePoints) {
      //console.log('myprofile')
      let profile = this.profilePoints[idx];
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
  this.map = L.map('map',
                    {maxZoom: 13,
                    minZoom: 1,
                    maxBounds: [[-180, -270], [180,270]],
                    layers: [this.mapService.baseMaps.ocean]})
                    .setView([ 46.88, -121.73 ], 2, );
  L.control.layers(this.mapService.baseMaps).addTo(this.map);
};

private createSouthernStereographic(this) {
  this.map = L.map('map',
                  {maxZoom: 13,
                    minZoom: 3,
                    maxBounds: [[-1080, -1080], [1080,1080]],
                    crs: this.mapService.sStereo})
                    .setView([-89, .1], 5);    
  this.mapService.geojsonLayer.addTo(this.map);
};

private createNorthernStereographic(this) {
  this.map = L.map('map',
                  {maxZoom: 13,
                    minZoom: 3,
                    maxBounds: [[-180, -540], [180,540]],
                    crs: this.mapService.nStereo})
                    .setView([89,.1], 5);
  this.mapService.geojsonLayer.addTo(this.map);
};

shapeSelectionOnMap(): void {
  // Extract GeoJson from featureGroup
  let features = this.queryService.getShapes();
  if (features) {
      this.mapService.platformProfileMarkersLayer.clearLayers(); //delete platform profiles
      this.mapService.markersLayer.clearLayers();

      this.platformProfileMarkersLayer.clearLayers();
      this.markersLayer.clearLayers();
      let base = '/selection/profiles/map'
      let dates = this.queryService.getDates();
      let presRange = this.queryService.getPresRange();
      let includeRealtime = this.queryService.getToggle();
      for (let i = 0; i < features.length; i++) {
          const shape = features[i].geometry.coordinates;
          const transformedShape = this.mapService.getTransformedShape(shape)
          let urlQuery = base+'?startDate=' + dates.startDate + '&endDate=' + dates.endDate +
                         '&presRange='+JSON.stringify(presRange) +
                         '&shape='+JSON.stringify([transformedShape] +
                         '&includeRT='+JSON.stringify(includeRealtime));
          console.log(urlQuery);
          this.pointsService.getSelectionPoints(urlQuery)
             .subscribe((data: ProfilePoints[]) => 
             {this.profilePoints = this.profilePoints.concat(data)});
          this.displayProfiles('normalMarker');
          //this.pointsService.displayProfiles(urlQuery, '', false);
      }
  }
}

}

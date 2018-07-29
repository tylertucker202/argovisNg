import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../map.service';
import { PointsService } from '../points.service'
import { ProfilePoints } from '../models/profile-points';
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
  public markersLayer = L.layerGroup();
  constructor(public mapService: MapService, public pointsService: PointsService) {}

  ngOnInit() {
    console.log('im in leaflet-map.component');
    console.log('mProj currently is:');
    console.log(this.mProj);
    this.profilePoints = this.pointsService.getMockPoints();
    this.generateMap();
    this.mapService.coordDisplay.addTo(this.map);
    this.mapService.drawnItems.addTo(this.map);
    this.mapService.scaleDisplay.addTo(this.map);
    this.mapService.drawControl.addTo(this.map);
    this.mapService.map = this.map;
    this.map.on('draw:created', (event: L.DrawEvents.Created) => {
      var layer = event.layer;
      this.mapService.popupWindowCreation(layer, this.mapService.drawnItems);
    });
    //console.log(this.profilePoints)
    // this.pointsService.getLatestProfiles()
    //   .subscribe((data: ProfilePoints[]) => 
    //     {this.profilePoints = data});
    //   console.log(this.profilePoints)
    this.displayProfiles('normalMarker', true);
    this.markersLayer.addTo(this.map);
    this.invalidateSize();
  }

  ngOnDestroy() {
      if (this.map != undefined) { 
        this.map.remove();
       }
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
        //this.createWebMercator();
        break;
      }
      case 'Northern Stereographic': {
        console.log('generating north stereo');
        this.createNorthernStereographic();
        //this.createWebMercator();
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

private displayProfiles = function(this, markerType, latestBool) {
    //this.pointsService.getSelectionPoints(profUrl)
    //console.log(this.profilePoints)

      //.subscribe((result: ProfilePoints[]) => {
      
      if (this.profilePoints.length > 1000 && latestBool === false) {
        //this.pointsService.closeDrawnItemPopups()
          alert("This query is too large."
          + " Only 1001 profiles will be included in the selection page."
          + " Try reducing the polygon size or date range."
          + " Another option is to use an API. See www.itsonlyamodel.us/argovis-python-api.html for more details.");
      }
      else {
          for (let idx in this.profilePoints) {
              //console.log('myprofile')
              let profile = this.profilePoints[idx];
              //console.log(profile)
              if (markerType==='history') {
                  this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.argoIconBW);
                  //this.pointsService.openDrawnItemPopups();
              }
              else if (markerType==='platform') {
                  this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.pointsService.platformIcon);
                  //this.pointsService.openDrawnItemPopups();
              }
              else {
                  this.pointsService.addToMarkersLayer(profile, this.markersLayer, this.argoIcon);
                  //this.pointsService.openDrawnItemPopups();
              }
          };
          console.log('mymarkers');
          console.log(this.markersLayer);
          this.markersLayer.addTo(this.map);
      }
//     }).fail(function(){
//         //console.log(result.length);
//         this.closeDrawnItemPopups(); 
//         alert('Points did not load, try reducing the polygon size or date range...or try restarting Argovis')});
  };

private createWebMercator(this) {
  this.map = L.map('map',
                    {maxZoom: 13,
                    minZoom: 1,
                    maxBounds: [[-180, -270], [180,270]],
                    layers: [this.mapService.baseMaps.ocean]})
                    .setView([ 46.88, -121.73 ], 2, );
  L.control.layers(this.mapService.baseMaps).addTo(this.map);
}

private createSouthernStereographic(this) {
  this.map = L.map('map',
                  {maxZoom: 13,
                    minZoom: 3,
                    //maxBounds: [[-1080, -1080], [1080,1080]],
                    crs: this.mapService.sStereo})
                    .setView([-89, .1], 5);    
  this.mapService.geojsonLayer.addTo(this.map);
};

private createNorthernStereographic(this) {
  this.map = L.map('map',
                  {maxZoom: 13,
                    minZoom: 3,
                    //maxBounds: [[-180, -540], [180,540]],
                    crs: this.mapService.nStereo})
                    .setView([89,.1], 5);
  this.mapService.geojsonLayer.addTo(this.map);
};

}

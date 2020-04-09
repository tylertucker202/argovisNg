import { Component, OnInit } from '@angular/core';
import { QueryProfviewService } from '../query-profview.service';
import { ProfileMeta } from '../profiles'
@Component({
  selector: 'app-globe-scatter',
  templateUrl: './globe-scatter.component.html',
  styleUrls: ['./globe-scatter.component.css']
})
export class GlobeScatterComponent implements OnInit {

  constructor(private queryProfviewService: QueryProfviewService) { }
  private graph: any

  ngOnInit(): void {

    let dataArrays = {lats: [], lon: [], ids: []}
    this.queryProfviewService.profileMetaChanged.subscribe((msg: string) => {
      const metaData = this.queryProfviewService.profileMeta
      metaData.forEach( (profileMeta: ProfileMeta) => {
        dataArrays.lats.push(profileMeta.lat)
        dataArrays.lon.push(profileMeta.lon)
        dataArrays.ids.push(profileMeta._id)
      } )

      this.graph = this.makeMap(dataArrays.lats, dataArrays.lon, dataArrays.ids)
    })

  }

  private onSelect(profile_id: string) {
    console.log('onSelect data:', profile_id)
    const url = '/catalog/profiles/' + profile_id + '/page';
    window.open(url,'_blank');
  }

  private makeMap(lats, longs, ids) {
    const minLong = Math.min(...longs)
    const maxLong = Math.max(...longs)
    const longRange = [minLong-5, maxLong+5]
    const latRange = [Math.min(...lats)-5, Math.max(...lats)+5]

    let midLong =  minLong + 5 //just make sure some of the points are in range
    if (longs.length === 1) {
        midLong = longs[0]
    }
    const midLat = (latRange[1] + latRange[0])/2
    const data = [{
        type: 'scattergeo',
        mode: 'markers',
        text: ids,
        lon: longs,
        lat: lats,
        marker: {
            size: 7,
                width: 1
            }
        
    }];

    const layout = {
        width:500,
        titlefont: {
            size: 16
        },
        margin: {
          l: 5,
          r: 5,
          b: 5,
          t: 5,
          pad: 5
        },
        geo: {
        projection: {
            type: 'orthographic',
            rotation: {
                lon: midLong,
                lat: midLat
            },
        },
            resolution: 50,
            lonaxis: {
                'range': longRange
            },
            lataxis: {
                'range': latRange
            },
            showland: true,
            landcolor: '#EAEAAE',
            countrycolor: '#d3d3d3',
            countrywidth: 1.5,
            subunitcolor: '#d3d3d3'
        }
    };

    return ({data: data, layout: layout})
}

}

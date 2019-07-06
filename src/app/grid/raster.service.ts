import { Injectable } from '@angular/core';
import { RasterGrid } from '../home/models/raster-grid'
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


import * as L from "leaflet";
//leaflet.canvaslayer.field.js depends on d3 and chroma scripts set in angular.json.
import './../../ext-js/leaflet.canvaslayer.field.js'
//import * as chroma from 'chroma'

declare let chroma: any

@Injectable({
  providedIn: 'root'
})
export class RasterService {

  public mockRaster: RasterGrid[] = [{_id:"5c920df6afc6ec31f7e5092b",pres:2.5,time:0.5,
                               cellXSize:1,cellYSize:1,noDataValue:-9999,
                               zs:[-0.9229999780654907,-0.9229999780654907,-0.9520000219345093,-0.9520000219345093,-0.9610000252723694,
                                -0.9610000252723694,-0.9620000123977661,-0.9620000123977661,-0.9070000052452087,-0.9070000052452087,
                                -0.8270000219345093,-0.8270000219345093,-0.7250000238418579,-0.7250000238418579,-0.6359999775886536,
                                -0.6359999775886536,-0.515999972820282,-0.515999972820282,-0.3959999978542328,-0.3959999978542328,
                                -0.32499998807907104,-0.32499998807907104,-0.3089999854564667,-0.3089999854564667,-0.2669999897480011,
                                -0.2669999897480011,-0.07599999755620956,-0.07599999755620956,0.12999999523162842,0.12999999523162842,
                                -0.6840000152587891,-0.6840000152587891,-0.7260000109672546,-0.7260000109672546,-0.8790000081062317,
                                -0.8790000081062317,-0.9210000038146973,-0.9210000038146973,-0.8970000147819519,-0.8970000147819519,
                                -0.8109999895095825,-0.8109999895095825,-0.7099999785423279,-0.7099999785423279,-0.6389999985694885,
                                -0.6389999985694885,-0.5289999842643738,-0.5289999842643738,-0.41600000858306885,-0.41600000858306885,
                                -0.34200000762939453,-0.34200000762939453,-0.22200000286102295,-0.22200000286102295,-0.0729999989271164,
                                -0.0729999989271164,0.039000000804662704,0.039000000804662704,0.1679999977350235,0.1679999977350235,
                                -0.5799999833106995,-0.5799999833106995,-0.7839999794960022,-0.7839999794960022,-0.9649999737739563,
                                -0.9649999737739563,-1.0789999961853027,-1.0789999961853027,-1.1410000324249268,-1.1410000324249268,
                                -1.0789999961853027,-1.0789999961853027,-1.0089999437332153,-1.0089999437332153,-0.878000020980835,
                                -0.878000020980835,-0.7139999866485596,-0.7139999866485596,-0.7080000042915344,-0.7080000042915344,
                                -0.6460000276565552,-0.6460000276565552,-0.4180000126361847,-0.4180000126361847,-0.2529999911785126,
                                -0.2529999911785126,-0.1379999965429306,-0.1379999965429306,-0.04800000041723251,-0.04800000041723251,
                                -0.46399998664855957,-0.46399998664855957,-0.5180000066757202,-0.5180000066757202,-0.6340000033378601,
                                -0.6340000033378601,-0.7400000095367432,-0.7400000095367432,-0.8009999990463257,-0.8009999990463257,
                                -0.7620000243186951,-0.7620000243186951,-0.5799999833106995,-0.5799999833106995,-0.4390000104904175,
                                -0.4390000104904175,-0.4580000042915344,-0.4580000042915344,-0.5109999775886536,-0.5109999775886536,
                                -0.4350000023841858,-0.4350000023841858,-0.2879999876022339,-0.2879999876022339,-0.1679999977350235,
                                -0.1679999977350235,-0.07500000298023224,-0.07500000298023224,0.010999999940395355,0.010999999940395355,
                                -0.37700000405311584,-0.37700000405311584,-0.3440000116825104,-0.3440000116825104,-0.3630000054836273,
                                -0.3630000054836273,-0.39500001072883606,-0.39500001072883606,-0.39100000262260437,-0.39100000262260437,
                                -0.3310000002384186,-0.3310000002384186,-0.21400000154972076,-0.21400000154972076,-0.11599999666213989,
                                -0.11599999666213989,-0.10300000011920929,-0.10300000011920929,-0.052000001072883606,-0.052000001072883606,
                                0.02500000037252903,0.02500000037252903,0.09099999815225601,0.09099999815225601,0.15299999713897705,
                                0.15299999713897705,0.2199999988079071,0.2199999988079071,0.2680000066757202,0.2680000066757202,
                                -0.15000000596046448,-0.15000000596046448,-0.14399999380111694,-0.14399999380111694,-0.1550000011920929,
                                -0.1550000011920929,-0.14800000190734863,-0.14800000190734863,-0.13699999451637268,-0.13699999451637268,
                                -0.08900000154972076,-0.08900000154972076,0.003000000026077032,0.003000000026077032,0.0949999988079071,
                                0.0949999988079071,0.12399999797344208,0.12399999797344208,0.20900000631809235,0.20900000631809235,
                                0.382999986410141,0.382999986410141,0.4650000035762787,0.4650000035762787,0.5149999856948853,
                                0.5149999856948853,0.5649999976158142,0.5649999976158142,0.5889999866485596,0.5889999866485596,
                                -0.10400000214576721,-0.10400000214576721,-0.09300000220537186,-0.09300000220537186,-0.07599999755620956,
                                -0.07599999755620956,-0.041999999433755875,-0.041999999433755875,-0.04100000113248825,-0.04100000113248825,
                                -0.024000000208616257,-0.024000000208616257,0.02199999988079071,0.02199999988079071,0.09600000083446503,
                                0.09600000083446503,0.18700000643730164,0.18700000643730164,0.3160000145435333,0.3160000145435333,
                                0.41499999165534973,0.41499999165534973,0.4569999873638153,0.4569999873638153,0.4830000102519989,
                                0.4830000102519989,0.5170000195503235,0.5170000195503235,0.527999997138977,0.527999997138977,
                                -0.09300000220537186,-0.09300000220537186,-0.06400000303983688,-0.06400000303983688,-0.039000000804662704,
                                -0.039000000804662704,-0.024000000208616257,-0.024000000208616257,-0.04399999976158142,-0.04399999976158142,
                                -0.04600000008940697,-0.04600000008940697,-0.014999999664723873,-0.014999999664723873,0.05700000002980232,
                                0.05700000002980232,0.14499999582767487,0.14499999582767487,0.23899999260902405,0.23899999260902405,
                                0.31700000166893005,0.31700000166893005,0.33899998664855957,0.33899998664855957,0.3700000047683716,
                                0.3700000047683716,0.4180000126361847,0.4180000126361847,0.42399999499320984,0.42399999499320984,
                                0.01600000075995922,0.01600000075995922,0.04600000008940697,0.04600000008940697,0.05700000002980232,
                                0.05700000002980232,0.07900000363588333,0.07900000363588333,0.08900000154972076,0.08900000154972076,
                                0.10400000214576721,0.10400000214576721,0.12399999797344208,0.12399999797344208,0.17100000381469727,
                                0.17100000381469727,0.23399999737739563,0.23399999737739563,0.3019999861717224,0.3019999861717224,
                                0.3580000102519989,0.3580000102519989,0.382999986410141,0.382999986410141,0.4259999990463257,
                                0.4259999990463257,0.47600001096725464,0.47600001096725464,0.5669999718666077,0.5669999718666077,
                                0.15600000321865082,0.15600000321865082,0.1850000023841858,0.1850000023841858,0.20800000429153442,
                                0.20800000429153442,0.22200000286102295,0.22200000286102295,0.22699999809265137,0.22699999809265137,
                                0.23399999737739563,0.23399999737739563,0.2639999985694885,0.2639999985694885,0.3059999942779541,
                                0.3059999942779541,0.36000001430511475,0.36000001430511475,0.41600000858306885,0.41600000858306885,
                                0.47099998593330383,0.47099998593330383,0.5130000114440918,0.5130000114440918,0.5809999704360962,
                                0.5809999704360962,0.6299999952316284,0.6299999952316284,0.7070000171661377,0.7070000171661377],
                                nRows:10,
                                nCols:15,
                                xllCorner:230.5,
                                yllCorner:0.5}]
  constructor(private http: HttpClient) { }

  public getMockGridRaster(): Observable<RasterGrid[]> {
    return of(this.mockRaster)
  }

  public getGridRasterProfiles(latRange: number[], lonRange: number[], monthYear: string, pres: number): Observable<RasterGrid[]> {
    let url = 'http://localhost:3000/kuuselaGrid?'
    url += 'latRange=' + JSON.stringify(latRange)
    url += '&lonRange=' + JSON.stringify(lonRange)
    url += '&monthYear=' + monthYear
    url += '&presLevel=' + JSON.stringify(pres)
    console.log(url)
    return this.http.get<RasterGrid[]>(url)
  }

  public addToGridLayer(grid: RasterGrid, gridLayer: L.LayerGroup): L.LayerGroup {

    for (var i = 0; i < grid.zs.length; i++){
      if (grid.zs[i] == grid.noDataValue) {
          grid.zs[i] = null;
        }
    }

    let s = new L.ScalarField(grid)
    console.log('scalar field')
    console.log(s)
    
    let c = chroma.scale('OrRd').domain(s.range);
    let layer = L.canvasLayer.scalarField(s, {
        color: c,
        interpolate: true
    });
    layer.setOpacity(0.8);

    layer.on('click', function (e) {
        if (e.value !== null) {
            let v = e.value.toFixed(3);
            let html = `<span class="popupText">Temperature Anomoly ${v} Deg</span>`;
            let popup = L.popup().setLatLng(e.latlng).setContent(html).openOn(this.map);
        }
    });

    gridLayer.addLayer(layer)


    return(gridLayer)

  }
}
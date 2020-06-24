import { Injectable } from '@angular/core';
import { RasterGrid, RasterParam, BaseRaster, Grid, GridCell } from '../models/raster-grid'
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { WasmService } from './wasm.service'
import { mockRaster, mockParamRaster, mockGrid } from './grid.items'

import * as L from "leaflet";
//leaflet.canvaslayer.field.js depends on d3 and chroma scripts set in angular.json.

import * as d3 from 'd3'; //needed for leaflet canvas layer
import './../../ext-js/leaflet.canvaslayer.field.js'
import * as chroma from 'chroma'
import { ChromaStatic, Scale, Color } from 'chroma-js';
declare const chroma: ChromaStatic;

@Injectable({
  providedIn: 'root'
})
export class RasterService {

  public mockRaster: RasterGrid[] = mockRaster
  public mockParamRaster: RasterParam[] = mockParamRaster
  public mockGrid: Grid[] = mockGrid

  constructor(
    private http: HttpClient, 
    private wasmService: WasmService 
   ) { }


  public getMockGridRaster(): Observable<RasterGrid[]> {
    return of(this.mockRaster)
  }

  public getMockGrid(): Observable<Grid[]> {
    return of(this.mockGrid)
  }

  public transform_lon(lon: number): number {
    if (lon < 0) {
      lon += 360
    }
    return lon
  }

  public make_grid_arrays(gridCells: GridCell[]) {
    //assumes lat and lon are sorted
    let lats = []
    let longs = []
    let values = []
    for (let idx = 0; idx < gridCells.length; ++idx) {
      const row = gridCells[idx]
      lats.push(row['lat'])
      const lon = this.transform_lon(row['long'])
      longs.push(lon)
      values.push(row['values'])
    }
    let uLats = []
    for (let idx = 0; idx < lats.length; ++idx) {
        if (uLats.includes(lats[idx])) {
          break
        }
        else {
            uLats.push(lats[idx])
        }
    }
    const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
    const nLats = uLats.length
    const uLongs = every_nth(lats, nLats)
    const nLongs = uLongs.length

    let matrix = [];
    while(values.length) matrix.push(values.splice(0,nLongs));
    return [uLats, nLats, uLongs, nLongs, matrix]
  }


  public makeRasterFromGrid(grid: Grid, latLngPoints: [number, number][], lon_0: number): RasterGrid {
    //assumes lat lng points are inside grid area
    let raster: RasterGrid
    raster._id = grid._id
    raster.gridName = grid.gridName
    raster.measurement = grid.measurement
    raster.pres = grid.pres
    raster.date = grid.date
    raster.units = grid.units

    //reshape grid data
    const [uLats, nLats, uLongs, nLongs, valuesMatrix] = this.make_grid_arrays(grid.data);

    //longitude is a uniform grid
    const dlon = uLongs[1] - uLongs[0]
    const minLon = Math.min(uLongs)

    let zs = []
    latLngPoints.forEach( ([lat, lon]) => {
      const lat_idx = this.get_lat_idx(uLats.tolist(), lat)
      const lon_idx = this.get_lon_idx(lon, dlon, lon_0)
      const llPoint = (uLongs[lon_idx], uLats[lat_idx], valuesMatrix[lon_idx][lat_idx])
      const lrPoint = (uLongs[lon_idx+1], uLats[lat_idx], valuesMatrix[lon_idx+1][lat_idx])
      const urPoint = (uLongs[lon_idx+1], uLats[lat_idx+1], valuesMatrix[lon_idx+1][lat_idx+1])
      const ulPoint = (uLongs[lon_idx], uLats[lat_idx+1], valuesMatrix[lon_idx][lat_idx+1])
      const points = [llPoint, lrPoint, urPoint, ulPoint]
      const intpValue = this.bilinear_interpolation(lon, lat, points)
      zs.push()
    })
    raster.zs = zs
    return raster
  }

  public get_lon_idx(lon, dlon, lon_0) {
    // finds idx of a uniformly spaced grid
    return  Math.ceil((lon - lon_0) / dlon)
  }
  public get_lat_idx(arr, target) {
    //binary search of nearest neighbor for an array of numbers
    //corner cases
    if (target <= arr[0]) { return 0 }
    if (target >= arr[ arr.length -1 ]) { return (arr.length - 1)}

    //iterative binary search
    let idx = 0; let jdx = arr.length; let mid = 0;
    while (idx < jdx) {
      mid = Math.ceil( (idx + jdx) / 2)

      if (arr[mid] === target) {
        return mid
      }

      if (target < arr[mid]) { //search for the left of mid
        // if target is greater than previous 
        // to mid, return closest of two
        if (mid > 0 && target > arr[mid-1]) {
          const closest_idx = this.get_closest_idx(arr[mid - 1], arr[mid], mid, target)
          return closest_idx
        }
        jdx = mid
      }
      else { // search to the right of mid
        if (mid < arr.length - 1 && target < arr[mid + 1]) {
          const closest_idx = this.get_closest_idx(arr[mid-1], arr[mid], mid, target)
          return closest_idx
        }
        idx = mid + 1
      }
    // Only single element after search
    return arr[mid]
    }
  }

  public get_closest_idx(val1: number, val2: number, mid: number, target: number): number {
      if (target - val1 >= val2 - target) { return mid }
      else { return mid-1}
  }

  public bilinear_interpolation(x: number, y: number, points: [number, number, number][]) {
    /*
    Interpolate (x,y) from values associated with four points.
    The four points are a list of four triplets:  [x, y, value].
    The four points can be in any order.  They should form a rectangle.
        bilinear_interpolation(12, 5.5,
        ...                        [(10, 4, 100),
        ...                         (20, 4, 200),
        ...                         (10, 6, 150),
        ...                         (20, 6, 300)])
        165.0
    See formula at:  http://en.wikipedia.org/wiki/Bilinear_interpolation
    */
    points = points.sort()
    const [x1, y1, q11] = points[0]
    const [_x1, y2, q12] = points[1] 
    const [x2, _y1, q21] = points[2]
    const [_x2, _y2, q22] = points[3]
    if ( x1 !== _x1 || x2 !== _x2 || y1 !== _y1 || y2 !== _y2) {
      console.error('points do not form a rectangle')
    }
    if ( x < x1 || x > x2 || y < y1 || y > y2) {
      console.error('(x,y) do not lie within rectangle')
    }
    return (q11 * (x2 - x) * (y2 - y) +
            q21 * (x - x1) * (y2 - y) +
            q12 * (x2 - x) * (y - y1) +
            q22 * (x - x1) * (y - y1)
           ) / ((x2 - x1) * (y2 - y1) + 0.0)
  }

  public getGrid( date: string, latRange: number[], lonRange: number[], pres: number,
    gridName: string): Observable<Grid[]> {
    let url = ''
    url += '/griddedProducts/nonUniformGrid/window?'
    url += 'latRange=' + JSON.stringify(latRange)
    url += '&lonRange=' + JSON.stringify(lonRange)
    url += '&presLevel=' + JSON.stringify(pres)
    url += '&date=' + date
    url += '&gridName=' + gridName
    console.log('url:', url)
    return this.http.get<Grid[]>(url)
    }

  public getParamRaster(latRange: number[], lonRange: number[], pres: number,
                       gridName: string, gridParam: string): Observable<RasterParam[]> {

    let url = ''
    url += '/griddedProducts/gridParams/window?'
    url += 'latRange=' + JSON.stringify(latRange)
    url += '&lonRange=' + JSON.stringify(lonRange)
    url += '&presLevel=' + JSON.stringify(pres)
    url += '&gridName=' + gridName
    url += '&param=' + gridParam
    return this.http.get<RasterParam[]>(url)
  }

  public getTwoParamRaster(latRange: number[], lonRange: number[], pres: number,
                           gridName: string, gridParam: string, gridName2): Observable<[RasterParam[], RasterParam[]]> {
    const numerendGrid = this.getParamRaster(latRange, lonRange, pres, gridName, gridParam)
    const subtrahendGrid = this.getParamRaster(latRange, lonRange, pres, gridName2, gridParam)
    const grids = forkJoin([numerendGrid, subtrahendGrid])
    return grids
  }

  public getGridRaster(latRange: number[], lonRange: number[], monthYear: string,
                       pres: number, gridName: string): Observable<RasterGrid[]> {
    let url = ''
    url += '/griddedProducts/grid/window?'
    url += 'latRange=' + JSON.stringify(latRange)
    url += '&lonRange=' + JSON.stringify(lonRange)
    url += '&gridName=' + gridName
    url += '&monthYear=' + monthYear
    url += '&presLevel=' + JSON.stringify(pres)
    return this.http.get<RasterGrid[]>(url)
  }

  public getTwoGridRasterProfiles(latRange: number[], lonRange: number[],
                                  monthYear: string, pres: number,
                                  gridName: string, gridName2: string): Observable<[RasterGrid[], RasterGrid[]]> {
      const numerendGrid = this.getGridRaster(latRange, lonRange, monthYear, pres, gridName)
      const subtrahendGrid = this.getGridRaster(latRange, lonRange, monthYear, pres, gridName2)
      const grids = forkJoin([numerendGrid, subtrahendGrid])
      return grids
  }

  public makeDiffGrid(rasterGrids: [RasterGrid[], RasterGrid[]] | [RasterParam[], RasterParam[]]): RasterGrid[] | RasterParam[] {
    const numerendGrid = rasterGrids[0][0]
    const subtrahendGrid = rasterGrids[1][0]
    let dGrid = numerendGrid;
    const gridName = numerendGrid['gridName'] + ' - ' + subtrahendGrid['gridName']
    let zs = []
    console.log('inside makeDiffGrid. adding two numbers using wasm')
    const wasmAdd = this.wasmService.add(100, 200)
    console.log('wasmAdd:', wasmAdd)
    console.log('did you see the answer (300)?')
    for (let idx = 0; idx < numerendGrid['zs'].length; idx++){
      
      const x1 = numerendGrid['zs'][idx]
      const x2 = subtrahendGrid['zs'][idx]
      let c: number;
      if (x1 === numerendGrid['noDataValue'] || x2 === subtrahendGrid['noDataValue']) {
        c = dGrid['noDataValue']
      }
      else{
        c = numerendGrid['zs'][idx] - subtrahendGrid['zs'][idx]
      }
      zs.push(c)
    }
    dGrid['zs'] = zs
    dGrid['gridName'] = gridName

    return [dGrid]
  }

  public makeScalarField(grid: RasterGrid | RasterParam): L.ScalarField {
    for (var i = 0; i < grid.zs.length; i++){
      if (grid.zs[i] == grid.noDataValue) {
          grid.zs[i] = null;
        }
    }
    const s = new L.ScalarField(grid)
    return s
  }

  private makeCanvasLayer(grid: RasterGrid | RasterParam, brewerColorScheme: string, inverseColorScale, interpolateBool: boolean, map: L.Map): L.ScalarField { 
    const s = this.makeScalarField(grid)
    let c: Scale<Color>
    if(interpolateBool) { c = chroma.scale(brewerColorScheme).domain(s.range.reverse()) }
    else { c = chroma.scale(brewerColorScheme).domain(s.range) }
    let layer = L.canvasLayer.scalarField(s, {
        color: c,
        interpolate: interpolateBool
    });
    layer['gridName'] = grid['gridName']
    layer['units'] = grid['units']
    layer['measurement'] =  grid['measurement']
    layer['param'] = grid['param']
    
    layer.on('click', function (e) {
      if (e.value !== null) {
          let v = e.value.toFixed(3);
          let html = `<span class="popupText"> ${layer['gridName']} <br /> ${layer['measurement']} <br /> ${layer['param']} <br /> ${v} ${layer['units']}</span>`;
          let popup = L.popup().setLatLng(e.latlng).setContent(html).openOn(map);
      }
      });
      return(layer)
  }

  public addCanvasToGridLayer(grid: RasterGrid | RasterParam, gridLayers: L.LayerGroup,
                              map: L.Map, interpolateBool: boolean, brewerColorScheme='OrRd', inverseColorScale=false): L.LayerGroup {
    let layer = this.makeCanvasLayer(grid, brewerColorScheme, inverseColorScale, interpolateBool, map)
    gridLayers.addLayer(layer)
    return gridLayers
  }

}
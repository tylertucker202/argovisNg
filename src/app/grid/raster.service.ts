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

  public make_grid_arrays(gridCells: GridCell[]): [number[], number[], number[][]] {
    //assumes lat and lon are sorted
    let lats = []
    let lons = []
    let values = []
    for (let idx = 0; idx < gridCells.length; ++idx) {
      const row = gridCells[idx]
      lats.push(row['lat'])
      const lon = this.transform_lon(row['lon'])
      lons.push(lon)
      values.push(row['value'])
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
    const uLons = every_nth(lons, nLats)
    const nLons = uLons.length

    let matrix = [];
    while(values.length) { matrix.push(values.splice(0,nLons)) };
    return [uLats, uLons, matrix]
  }

  public makeRegridArray(arr: number[], delta: number): number[] {
    //find n columns of star_arr
    const rangeArr = arr[arr.length -1] - arr[0]
    const ncols = Math.floor(rangeArr / delta)
    //set first star_arr element
    const rem = rangeArr % delta
    let star_arr = [ arr[0] + rem/2 ]
    // populate star_arr
    while (star_arr.length < ncols ) {
      star_arr.push(star_arr[star_arr.length-1] + delta)
    }
    return star_arr
  }

  public makeRasterFromGrid(grid: Grid, delta: number): RasterGrid {
    //assumes lat lng points are inside grid area
    let raster = {}
    raster['_id'] = grid['_id']
    raster['gridName'] = grid['gridName']
    raster['measurement'] = grid['measurement']
    raster['pres'] = grid['pres']
    raster['date'] = grid['date']
    raster['units'] = grid['units']
    const [uLats, uLons, valuesMatrix] = this.make_grid_arrays(grid['data']);
    const star_lats = this.makeRegridArray(uLats, delta)
    const star_lons = this.makeRegridArray(uLons, delta)
    raster['nCols'] = star_lons.length
    raster['nRows'] = star_lats.length
    raster['noDataValue'] = -9999
    raster['cellXSize'] = delta
    raster['cellYSize'] = delta
    raster['xllCorner'] = star_lons[0]
    raster['yllCorner'] = star_lats[0]

    let points = []
    for (let idx=0; idx<star_lats.length; ++idx) {
      for (let jdx=0; jdx<star_lons.length; ++jdx) {
        points.push([star_lats[idx], star_lons[jdx]])
      }
    }
    raster['zs'] = this.interpolateGrid(points, valuesMatrix, uLats, uLons)

    return raster as RasterGrid
  }


  public interpolateGrid(latLngPoints: [number, number][], valuesMatrix: number[][],  uLats: number[], uLons: number[] ): number[] {

    //longitude is a uniform grid
    const dlon = uLons[1] - uLons[0]
    const minLon = Math.min(...uLons)

    let zs = []
    latLngPoints.forEach( ([lat, lon]) => {
      const [lat_idx, lat_shift] = this.get_nearest_neighbor(uLats, lat)
      const lon_idx = this.get_uniform_idx(lon, dlon, minLon)
      const llPoint = [uLons[lon_idx], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx]] as [number, number, number]
      const lrPoint = [uLons[lon_idx+1], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx+1]] as [number, number, number]
      const urPoint = [uLons[lon_idx+1], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx+1]] as [number, number, number]
      const ulPoint = [uLons[lon_idx], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx]] as [number, number, number]
      const points = [llPoint, lrPoint, urPoint, ulPoint]
      const intpValue = this.bilinear_interpolation(lon, lat, points)
      zs.push(intpValue)
    })
    return zs
  }

  public get_uniform_idx(lon: number, dlon: number, lon_0: number) {
    // finds idx of a uniformly spaced grid
    return  Math.floor((lon - lon_0) / dlon)
  }
  public get_nearest_neighbor(arr, target): [number, number] {
    //binary search of nearest neighbor for an array of numbers
    // todo: come up with a starting guess to reduce the number of steps?.

    //corner cases
    if (target <= arr[0]) { 
      // console.log('beginning corner case')
      return [0, 1] 
    }
    if (target >= arr[ arr.length -1 ]) { 
      // console.log('ending corner case')
      return [arr.length - 1, -1]
    }

    //iterative binary search
    let idx = 0; let jdx = arr.length-1; let mid = 0;

    // console.log('target: ', target, 'arr[idx]', arr[idx], 'arr[jdx]', arr[jdx])
    while (idx < jdx) {
      mid = Math.ceil( (idx + jdx) / 2)

      if (arr[mid] === target) {
        // console.log('target is midpoint', mid, jdx, idx)
        return [mid, 1]
      }

      if (target < arr[mid]) { //search for the left of mid
        // if target is greater than previous 
        // to mid, return closest of two
        if (mid > 0 && target > arr[mid-1]) {
          const [closest_idx, shift] = this.get_closest_idx(arr[mid - 1], arr[mid], mid-1, target)
          // console.log('idx is to the left of target')
          return [closest_idx, shift]
        }
        jdx = mid
        // console.log('target: ', target, 'arr[idx]', arr[idx], 'arr[jdx]', arr[jdx])
      }
      else { // search to the right of mid
        if (mid < arr.length - 1 && target < arr[mid + 1]) {
          // console.log('idx is to the right of target')
          const [ closest_idx, shift ] = this.get_closest_idx(arr[mid], arr[mid+1], mid, target)
          return [closest_idx, shift]
        }
        idx = mid + 1
        // console.log('target: ', target, 'arr[idx]', arr[idx], 'arr[jdx]', arr[jdx])
      }
    }
    // Only single element after search
    // console.log('only single element returned after search')
    return [mid, 1]
    
  }

  public get_closest_idx(val1: number, val2: number, val1_idx: number, target: number): [number, number] {
      if (target - val1 >= val2 - target) { return [val1_idx+1, -1] }
      else { return [val1_idx, 1]}
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
    points = points.sort(function(a, b) {
      if (a[0] == b[0]) {
        return a[1] - b[1];
      }
      return a[0] - b[0];
    })
    const [x1, y1, q11] = points[0]
    const [_x1, y2, q12] = points[1] 
    const [x2, _y1, q21] = points[2]
    const [_x2, _y2, q22] = points[3]
    if ( x1 !== _x1 || x2 !== _x2 || y1 !== _y1 || y2 !== _y2) {
      console.error('points do not form a rectangle')
    }
    if ( x < x1 || x > x2 || y < y1 || y > y2) {
      console.error('(x,y) do not lie within rectangle', x, y, 'points:', points)
    }
    return (q11 * (x2 - x) * (y2 - y) +
            q21 * (x - x1) * (y2 - y) +
            q12 * (x2 - x) * (y - y1) +
            q22 * (x - x1) * (y - y1)
           ) / ((x2 - x1) * (y2 - y1) + 0.0)
  }

  public getNonUniformGrid( date: string, latRange: number[], lonRange: number[], pres: number,
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

  public getGridRaster(latRange: number[], lonRange: number[], date: string,
                       pres: number, gridName: string): Observable<RasterGrid[]> {
    let url = ''
    url += '/griddedProducts/grid/window?'
    url += 'latRange=' + JSON.stringify(latRange)
    url += '&lonRange=' + JSON.stringify(lonRange)
    url += '&gridName=' + gridName
    url += '&date=' + date
    url += '&presLevel=' + JSON.stringify(pres)
    return this.http.get<RasterGrid[]>(url)
  }

  public getTwoGridRasterProfiles(latRange: number[], lonRange: number[],
                                  date: string, pres: number,
                                  gridName: string, gridName2: string): Observable<[RasterGrid[], RasterGrid[]]> {
      const numerendGrid = this.getGridRaster(latRange, lonRange, date, pres, gridName)
      const subtrahendGrid = this.getGridRaster(latRange, lonRange, date, pres, gridName2)
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
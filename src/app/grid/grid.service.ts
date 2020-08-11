import { Injectable, Injector } from '@angular/core';
import { RasterGrid, Grid, GridCell, GridCoords } from '../models/raster-grid'

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor(public injector: Injector) { }

  public transform_lon(lon: number): number {
    //not currently used
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
      lons.push(row['lon'])
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
    while(values.length) { matrix.push(values.splice(0,nLats)) };
    matrix = this.transpose(matrix)
    return [uLats, uLons, matrix]
  }

  public transpose(matrix) {
    //Object.keys yields an array of column indexes. We map these over a row mapping, returning the column value for each row. 
    return Object.keys(matrix[0]).map(function(col) {
        return matrix.map(function(row) { return row[col]; });
    });
  }

  public createZeroGrid(lons: number[], lats: number[]): GridCell[] {
    // returns 1d array of a 2d grid flattened column wise
    //return [].concat(...lats.map( lat => lons.map( lon => [].concat({lat: lat, lon: lon, value: 0})[0] )))
    return [].concat(...lons.map( lon => lats.map( lat => [].concat({lat: lat, lon: lon, value: 0})[0] )))
  }

  public desparseGrid( sparseGrid: GridCell[], gridCoords: GridCoords) {
    let fullGrid = this.createZeroGrid(gridCoords.lons, gridCoords.lats)
    // console.log(`grid is nCols ${gridCoords.lons.length}, by nRows ${gridCoords.lats.length}`)
    
    // sparseGrid.forEach( (gridCell: GridCell) => {
    //   const idx = fullGrid.findIndex( (gc) => gc.lat === gridCell.lat && gc.lon === gridCell.lon );
    //   //TODO: use forloop for better performance
    //   const lat_idx = this.binaryFindIndex(gridCoords.lats, gridCell.lat)
    //   const lon_idx = this.binaryFindIndex(gridCoords.lons, gridCell.lon)
    //   //const bs_idx = lat_idx * (gridCoords.lats.length) + lon_idx
    //   const bs_idx = lon_idx * (gridCoords.lats.length) + lat_idx
    //   console.log(`grid cell lat lng ${gridCell.lat} ${gridCell.lon} has bs_idx=${bs_idx}, idx=${idx}, equal? ${bs_idx === idx}`)
    //   fullGrid[idx].value = gridCell.value
    // })

    const t1 = performance.now();
    // sparseGrid.forEach( (gridCell: GridCell) => {
    //   const idx = fullGrid.findIndex( (gc) => gc.lat === gridCell.lat && gc.lon === gridCell.lon );
    //   fullGrid[idx].value = gridCell.value
    // })

    const t2 = performance.now();
    const duration_find = t2 - t1;
    
    const t3 = performance.now();
    sparseGrid.forEach( (gridCell: GridCell) => {
      const lat_idx = this.binaryFindIndex(gridCoords.lats, gridCell.lat)
      const lon_idx = this.binaryFindIndex(gridCoords.lons, gridCell.lon)
      const idx = lon_idx * (gridCoords.lats.length) + lat_idx
      fullGrid[idx].value = gridCell.value
    })
    const t4 = performance.now();
    const duration_bs = t4 - t3;
    console.log(`duration_find: ${duration_find} duration_bs: ${duration_bs}`)
    // console.log('fullGrid after:', JSON.stringify(fullGrid))
    return fullGrid
  }

  public binaryFindIndex( arr: number[], x: number): number {
    let start=0, end=arr.length-1; 
          
    // Iterate while start not meets end 
    while (start<=end){ 
        // Find the mid index 
        let mid=Math.floor((start + end)/2); 
        // If element is present at mid, return mid 
        if (arr[mid]===x) return mid; 
        // Else look in left or right half accordingly 
        else if (arr[mid] < x)  
              start = mid + 1; 
        else
              end = mid - 1; 
    } 
    
    return -1; 
  }

  public makeRegridArray(arr: number[], delta: number, nDec=3): number[] {
    //find n columns of star_arr
    const rangeArr = arr[arr.length -1] - arr[0]
    const star_arr_length = Math.floor(rangeArr / delta)
    //set first star_arr element
    const rem = rangeArr % delta
    let star_arr = [ arr[0] + rem/2 ]
    // populate star_arr
    while (star_arr.length < star_arr_length ) {
      const star = Number((star_arr[star_arr.length-1] + delta).toFixed(nDec)).valueOf()
      star_arr.push(star)
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

    let latLngPoints = []
    star_lats.reverse()
    for (let idx=0; idx<star_lats.length; ++idx) {
      for (let jdx=0; jdx<star_lons.length; ++jdx) {
        latLngPoints.push([star_lats[idx], star_lons[jdx]])
      }
    }
    raster['zs'] = this.interpolateGrid(latLngPoints, valuesMatrix, uLats, uLons)
    return raster as RasterGrid
  }


  public interpolateGrid(latLngPoints: [number, number][], valuesMatrix: number[][],  uLats: number[], uLons: number[] ): number[] {

    // //longitude is a uniform grid
    // const dlon = uLons[1] - uLons[0]
    // const minLon = Math.min(...uLons)

    let zs = []
    const t1 = performance.now();
    latLngPoints.forEach( ([lat, lon]) => {
      const [lat_idx, lat_shift] = this.get_nearest_neighbor(uLats, lat)
      //const lon_idx = this.get_uniform_idx(lon, dlon, minLon) //lon is not actually uniform!
      //const lon_shift = 1
      const [lon_idx, lon_shift] = this.get_nearest_neighbor(uLons, lon)
      const llPoint = [uLons[lon_idx], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx]] as [number, number, number]
      const lrPoint = [uLons[lon_idx+lon_shift], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx+lon_shift]] as [number, number, number]
      const urPoint = [uLons[lon_idx+lon_shift], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx+lon_shift]] as [number, number, number]
      const ulPoint = [uLons[lon_idx], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx]] as [number, number, number]
      const points = [llPoint, lrPoint, urPoint, ulPoint]
      const intpValue = this.bilinear_interpolation(lon, lat, points)
      zs.push(intpValue)
    })
    const t2 = performance.now();

    console.log('interpolation took: ', t2-t1)
    return zs
  }

  public get_uniform_idx(coord: number, delta: number, coord_0: number): number {
    // finds idx of a uniformly spaced grid
    return  Math.floor(Math.abs(coord - coord_0) / delta)
  }
  public get_nearest_neighbor(arr, target): [number, number] {
    //binary search of nearest neighbor for an array of numbers

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
    let idx = 0; let jdx = arr.length-1; let mid=0;
    
    while (idx < jdx) {
      mid = Math.ceil( (idx + jdx) / 2)
      // console.log('yet another loop. idx: ', idx, 'jdx: ', jdx, 'mid: ', mid, 
      // 'target: ', target, 'arr[idx]', arr[idx], 'arr[jdx]', arr[jdx])

      if (arr[mid] === target) {
        // console.log('target is midpoint', mid, jdx, idx)
        return [mid, 1]
      }

      if (arr[idx] === target) {
        // console.log('targed is left edge', mid, jdx, idx)
        return [idx, 1]
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

}

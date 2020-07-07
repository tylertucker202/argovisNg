import { TestBed, inject } from '@angular/core/testing';
import { RasterGrid } from '../models/raster-grid'
import { RasterService } from './raster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { WasmService } from './wasm.service'
import * as L from "leaflet";
fdescribe('RasterService', () => {
  beforeEach(async() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ RasterService ],
  }));
  it('should be created', () => {
    const service: RasterService = TestBed.get(RasterService);
    expect(service).toBeTruthy();
  });

  it('should get mock raster grid', inject([RasterService], (service: RasterService) => {
    const mockGrid = service.getMockGridRaster()
    mockGrid.subscribe( (grids: RasterGrid[]) => {
      expect(grids.length).toEqual(1)
      const grid = grids[0]
      expect(grid.nRows).toEqual(10)
      expect(grid.nCols).toEqual(15)
      expect(grid.xllCorner).toEqual(230.5)
      expect(grid.yllCorner).toEqual(0.5)
      expect(grid._id).toEqual('5c920df6afc6ec31f7e5092b')
      expect(grid.pres).toEqual(2.5)
      expect(grid.time).toEqual(0.5)
      expect(grid.cellXSize).toEqual(1)
      expect(grid.cellYSize).toEqual(1)
      expect(grid.noDataValue).toEqual(-9999)
    },
      error => {
        console.log('error in getting mock profiles' )
      })

    }))

  it('should get mock non uniform grid', inject([RasterService], (service: RasterService) => {
    const mockGrid = service.getMockGrid()
    expect(mockGrid).toBeTruthy()
  }))

  it('should properly index lat', inject([RasterService], (service, RasterService) => {
    const uLats = [-5, -2.5, 0, 2.5, 5]

    const t1 = 0
    const [lat_idx_1, lat_idx_1_shift] = service.get_nearest_neighbor(uLats, t1)
    expect(lat_idx_1).toEqual(2)
    expect(lat_idx_1_shift).toEqual(1)
    const t2 = -0.1
    const [lat_idx_2, lat_idx_2_shift] = service.get_nearest_neighbor(uLats, t2)
    expect(lat_idx_2).toEqual(2)
    expect(lat_idx_2_shift).toEqual(-1)
    const t3 = -2.4
    const [lat_idx_3, lat_idx_3_shift] = service.get_nearest_neighbor(uLats, t3)
    expect(lat_idx_3).toEqual(1)
    expect(lat_idx_3_shift).toEqual(1)
    const t4 = 2.6
    const [lat_idx_4, lat_idx_4_shift] = service.get_nearest_neighbor(uLats, t4)
    expect(lat_idx_4).toEqual(3)
    expect(lat_idx_4_shift).toEqual(1)
    const t5 = 4.6
    const [lat_idx_5, lat_idx_5_shift] = service.get_nearest_neighbor(uLats, t5)
    expect(lat_idx_5).toEqual(4)
    expect(lat_idx_5_shift).toEqual(-1)
  }))

  it('should make grid arrays', inject([RasterService], (service: RasterService) => {
    service.getMockGrid()
    .subscribe( grid => {
      const [uLats, uLons, valuesMatrix] = service.make_grid_arrays(grid[0].data);
      expect(uLats).toBeTruthy()
      expect(uLons).toBeTruthy()
      for (let idx = 1; idx<uLats.length; ++idx) {
        expect(uLats[idx]).toBeGreaterThan(uLats[idx-1])
      }
      for (let idx = 1; idx<uLons.length; ++idx) {
        expect(uLons[idx]).toBeGreaterThan(uLons[idx-1])
      }
      // console.log('nLats', nLats, 'nLons', nLons)
      expect(uLats.length).toEqual(39)
      expect(uLons.length).toEqual(15)
      // console.log('valuesMatrix', valuesMatrix.length, valuesMatrix[0].length)
      expect(valuesMatrix.length).toEqual(uLats.length)
      expect(valuesMatrix[0].length).toEqual(uLons.length)
      const lat = -67.5
      const lon = 1.25
      const dlon = uLons[1] - uLons[0]
      const minLon = uLons[0]
      const lon_idx = service.get_uniform_idx(lon, dlon, minLon)
      expect(lon_idx===4)
      expect(uLons[lon_idx] === 1.5)
      const [lat_idx, lat_shift] = service.get_nearest_neighbor(uLats, lat)
      expect(lat_shift===-1)
      expect(lat_idx===20)
      expect(uLats[lat_idx] === -67.519)
      // console.log('valuesMatrix[lon_idx][lon_idx]',valuesMatrix[lat_idx][lon_idx])
      const llPoint = [uLons[lon_idx], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx]] as [number, number, number]
      const lrPoint = [uLons[lon_idx+1], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx+1]] as [number, number, number]
      const urPoint = [uLons[lon_idx+1], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx+1]] as [number, number, number]
      const ulPoint = [uLons[lon_idx], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx]] as [number, number, number]
      const points = [llPoint, lrPoint, urPoint, ulPoint]
      const intpValue = service.bilinear_interpolation(lon, lat, points)
      console.log('points', points, 'intpValue', intpValue)
      expect(intpValue).toEqual(0.00007948320375250093)
    })
  }))

  it('should make regrid', inject([RasterService], (service: RasterService) => {
    service.getMockGrid()
    .subscribe( grid => {
      const [uLats, uLons, valuesMatrix] = service.make_grid_arrays(grid[0].data);
      const delta = .25
      const star_lats = service.makeRegridArray(uLats, delta)
      const star_lons = service.makeRegridArray(uLons, delta)
      // console.log('uLats', uLats, 'star_lats', star_lats)
      // console.log('uLons', uLons, 'star_lons', star_lons)

      expect(star_lats[0]).toBeGreaterThanOrEqual(uLats[0], 'extrapolating not allowed')
      expect(star_lats[star_lats.length-1]).toBeLessThanOrEqual(uLats[uLats.length-1], 'extrapolating not allowed')
      for (let idx=1; idx<star_lats.length; ++idx) {
        const delta_star = star_lats[idx] - star_lats[idx-1]
        expect(delta_star).toBeGreaterThan(0, 'always be increasing')
        expect(delta_star.toFixed(5)).toEqual(delta.toFixed(5), 'delta has changed')
      }

      expect(star_lons[0]).toBeGreaterThanOrEqual(uLons[0], 'extrapolating not allowed')
      expect(star_lons[star_lons.length-1]).toBeLessThanOrEqual(uLons[uLons.length-1], 'extrapolating not allowed')
      for (let idx=1; idx<star_lons.length; ++idx) {
        const delta_star = star_lons[idx] - star_lons[idx-1]
        expect(delta_star).toBeGreaterThan(0, 'always be increasing')
        expect(delta_star.toFixed(5)).toEqual(delta.toFixed(5), 'delta has changed')
      }
    })
  }))

  
  it('should do bilinear interpolation', inject([RasterService], (service: RasterService) => {
    service.getMockGrid()
    .subscribe( grid => {
      const delta = .25
      const [uLats, uLons, valuesMatrix] = service.make_grid_arrays(grid[0]['data']);
      const star_lats = service.makeRegridArray(uLats, delta)
      const star_lons = service.makeRegridArray(uLons, delta)
      let points = []
      for (let idx=0; idx<star_lats.length; ++idx) {
        for (let jdx=0; jdx<star_lons.length; ++jdx) {
          points.push([star_lats[idx], star_lons[jdx]])
        }
      }
      let zs = []
      const dlon = uLons[1] - uLons[0]
      const minLon = Math.min(...uLons)
      // console.log('ulats: ', uLats)
      points.forEach( ([lat, lon]) => {
        const [lat_idx, lat_shift] = service.get_nearest_neighbor(uLats, lat)
        const lon_idx = service.get_uniform_idx(lon, dlon, minLon)
        // console.log('lat, lon, lon_idx, lat_idx, latshift:', lat, lon, lon_idx, lat_idx, lat_shift)
        const llPoint = [uLons[lon_idx], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx]] as [number, number, number]
        const lrPoint = [uLons[lon_idx+1], uLats[lat_idx], valuesMatrix[lat_idx][lon_idx+1]] as [number, number, number]
        const urPoint = [uLons[lon_idx+1], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx+1]] as [number, number, number]
        const ulPoint = [uLons[lon_idx], uLats[lat_idx+lat_shift], valuesMatrix[lat_idx+lat_shift][lon_idx]] as [number, number, number]
        let points = [llPoint, lrPoint, urPoint, ulPoint]
        // console.log('lat lng intp', lat, lon, 'points', points)
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
          expect(false).toEqual(true, 'points do not form a rectangle')
        }
        if ( lon < x1 || lon > x2 || lat < y1 || lat > y2) {
          expect(false).toEqual(true, '(x,y) do not lie within rectangle')
        }
        const intpValue = service.bilinear_interpolation(lon, lat, points)
        zs.push(intpValue)
      })
    })
  }))

  it('should make rasterGrid from grid', inject([RasterService], (service: RasterService) => {
    service.getMockGrid()
    .subscribe( grid => {
      const delta = .25
      // console.log('grid', grid[0]['data'][0:10])
      expect(delta).toBeTruthy()
      const raster = service.makeRasterFromGrid(grid[0], delta)
      expect(raster).toBeTruthy()
      // console.log('raster', raster)
    })
  }))
  
  it('should get lat and lon idx ', inject([RasterService], (service: RasterService) => {
    const lat = -67.5
    const lon = 1.25
    service.getMockGrid()
    .subscribe( grid => {
      const [uLats, uLons, valuesMatrix] = service.make_grid_arrays(grid[0]['data']);
      const dlon = uLons[1] - uLons[0]
      const minLon = Math.min(...uLons)
      const [lat_idx, lat_shift] = service.get_nearest_neighbor(uLats, lat)
      expect(lat_idx).toEqual(20)
      expect(uLats[lat_idx]).toEqual(-67.519)
      const lon_idx = service.get_uniform_idx(lon, dlon, minLon)
      expect(lon_idx).toEqual(3)
      expect(uLons[lon_idx]).toEqual(1.167)
    })
  }))

  // it('should make canvas layer', inject([RasterService], (service: RasterService) => {
  //   const mockGrid = service.getMockGridRaster()

  //   mockGrid.subscribe( (grids: RasterGrid[]) => {

  //     const brewerColorScheme = 'RdPu'
  //     const grid = grids[0]
  //     const interpolateBool = false;
  //     const map = L.map('#map')
  //     const makeCanvasLayer = service['makeCanvasLayer']
  //     const layer = makeCanvasLayer(grid, brewerColorScheme,true, interpolateBool, map)
  //     expect(layer).toBeTruthy()
  //   },
  //     error => {
  //       console.log('error in getting mock profiles' )
  //     })

  // }));

});

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

  it('should make grid arrays', inject([RasterService], (service: RasterService) => {
    service.getMockGrid()
    .subscribe( grid => {
      const [uLats, nLats, uLons, nLons, valuesMatrix] = service.make_grid_arrays(grid[0].data);
      expect(uLats).toBeTruthy()
      expect(uLons).toBeTruthy()
      for (let idx = 1; idx<uLats.length; ++idx) {
        expect(uLats[idx]).toBeGreaterThan(uLats[idx-1])
      }
      for (let idx = 1; idx<uLons.length; ++idx) {
        expect(uLons[idx]).toBeGreaterThan(uLons[idx-1])
      }
      // console.log('nLats', nLats, 'nLons', nLons)
      expect(nLats).toEqual(39)
      expect(nLons).toEqual(15)
      // console.log('valuesMatrix', valuesMatrix.length, valuesMatrix[0].length)
      expect(valuesMatrix.length).toEqual(nLats)
      expect(valuesMatrix[0].length).toEqual(nLons)
      const lat = -67.5
      const lon = 1.25
      const dlon = uLons[1] - uLons[0]
      const minLon = uLons[0]
      const lon_idx = service.get_lon_idx(lon, dlon, minLon)
      expect(lon_idx===4)
      expect(uLons[lon_idx] === 1.5)
      const [lat_idx, lat_shift] = service.get_lat_idx(uLats, lat)
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
  
  // it('should get lat and lon idx ', inject([RasterService], (service: RasterService) => {
  //   const lat = -67.5
  //   const lon = 1.25
  //   service.getMockGrid()
  //   .subscribe( grid => {
  //     const [uLats, nLats, uLons, nLons, valuesMatrix] = service.make_grid_arrays(grid[0].data);
  //     const dlon = uLons[1] - uLons[0]
  //     const minLon = Math.min(uLons)
  //     const lat_idx = this.get_lat_idx(uLats, lat)
  //     expect(lat_idx===20)
  //     expect(uLats[lat_idx] === -67.519)
  //     const lon_idx = this.get_lon_idx(lon, dlon, minLon)
  //     expect(lon_idx===4)
  //     expect(uLons[lon_idx] === 1.5)
  //   })
  // }))

  // it('should perform bilinear interpolation', inject([RasterService], (service: RasterService) => {
  //   const mockGrid = service.getMockGrid()
  // }))

  // it('should make canvas layer', inject([RasterService], (service: RasterService) => {
  //   const mockGrid = service.getMockGridRaster()

  //   mockGrid.subscribe( (grids: RasterGrid[]) => {

  //     const brewerColorScheme = 'RdPu'
  //     const grid = grids[0]
  //     const interpolateBool = false;
  //     const map = L.map('#map')
  //     const makeCanvasLayer = service['makeCanvasLayer']
  //     const layer = makeCanvasLayer(grid, brewerColorScheme, interpolateBool, map)
  //     expect(layer).toBeTruthy()
  //     expect(layer.options.interpolate).toEqual(false)
  //   },
  //     error => {
  //       console.log('error in getting mock profiles' )
  //     })

  // }));

});

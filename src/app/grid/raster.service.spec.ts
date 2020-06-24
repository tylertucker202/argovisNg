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
    console.log('inside raster mock test')
    mockGrid.subscribe( (grids: RasterGrid[]) => {
      expect(grids.length).toEqual(1)
      console.log('wse got a grid')
      const grid = grids[0]
      expect(grid.nRows).toEqual(10)
      expect(grid.nCols).toEqual(15)
      expect(grid.xllCorner).toEqual(230.5)
      expect(grid.yllCorner).toEqual(0.5)
      expect(grid._id).toEqual('5c920df6afc6ec31f7e5092b')
      expect(grid.pres).toEqual(2.5)
      // expect(grid.time).toEqual(0.5)
      expect(grid.cellXSize).toEqual(1)
      expect(grid.cellYSize).toEqual(1)
      expect(grid.noDataValue).toEqual(-9999)
    },
      error => {
        console.log('error in getting mock profiles' )
      })

    }))

  it('should get mock non uniform grid') , inject([RasterService], (service: RasterService) => {
    const mockGrid = service.getMockGrid()
  })

  it('should make grid arrays') , inject([RasterService], (service: RasterService) => {
    const mockGrid = service.getMockGrid()
  })
  
  it('should get lat and lon idx ') , inject([RasterService], (service: RasterService) => {
    const mockGrid = service.getMockGrid()
  })

  it('should perform bilinear interpolation'), inject([RasterService], (service: RasterService) => {
    const mockGrid = service.getMockGrid()
  })

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

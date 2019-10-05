import { TestBed, inject } from '@angular/core/testing';
import { RasterGrid } from '../home/models/raster-grid'
import { RasterService } from './raster.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RasterService', () => {
  beforeEach(async() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ RasterService ],
  }));
  it('should be created', () => {
    const service: RasterService = TestBed.get(RasterService);
    expect(service).toBeTruthy();
  });

  it('should get mock grid', inject([RasterService], (service: RasterService) => {
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

  }));

  it('should make canvas layer', inject([RasterService], (service: RasterService) => {
    const mockGrid = service.getMockGridRaster()

    mockGrid.subscribe( (grids: RasterGrid[]) => {

      const brewerColorScheme = 'RdPu'
      const grid = grids[0]
      const layer = service.makeCanvasLayer(grid, brewerColorScheme)
      expect(layer).toBeTruthy()
      expect(layer.options.interpolate).toEqual(false)

      const color = layer.options.color
      const zeroColor = [ 222.5757573724622, 55.1515147449244, 151.60606052787008, 1 ]
      const layerZeroColor = color(0)._rgb
      expect(layerZeroColor[0]).toEqual(zeroColor[0])
      expect(layerZeroColor[1]).toEqual(zeroColor[1])
      expect(layerZeroColor[2]).toEqual(zeroColor[2])
      expect(layerZeroColor[3]).toEqual(zeroColor[3])
    },
      error => {
        console.log('error in getting mock profiles' )
      })

  }));

});

import { TestBed } from '@angular/core/testing';

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
});

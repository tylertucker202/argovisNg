import { TestBed } from '@angular/core/testing';
import { ArShapeService } from './ar-shape.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ArShapeService', () => {
  beforeEach(() => 
  TestBed.configureTestingModule({
    providers: [  ], 
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: ArShapeService = TestBed.get(ArShapeService);
    expect(service).toBeTruthy();
  });
});

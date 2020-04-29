import { TestBed } from '@angular/core/testing';

import { ArMapService } from './ar-map.service';
import { ShapePopupComponent } from '../home/shape-popup/shape-popup.component';
import { PopupCompileService } from '../home/services/popup-compile.service';

describe('ArMapService', () => {
  let service: ArMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ArMapService, ShapePopupComponent, PopupCompileService]
    });
    service = TestBed.inject(ArMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

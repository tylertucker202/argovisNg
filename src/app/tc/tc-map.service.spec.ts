import { RouterTestingModule } from '@angular/router/testing';
import { PopupCompileService } from './../home/services/popup-compile.service';
import { ShapePopupComponent } from './../home/shape-popup/shape-popup.component';
import { TestBed } from '@angular/core/testing';

import { TcMapService } from './tc-map.service';
import { TcQueryService } from './tc-query.service';

describe('TcMapService', () => {
  let service: TcMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ TcMapService, TcQueryService, ShapePopupComponent, PopupCompileService],
      imports: [RouterTestingModule]
    });
    service = TestBed.inject(TcMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

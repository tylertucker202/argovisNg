import { TestBed, inject } from '@angular/core/testing';

import { PopupCompileService } from './popup-compile.service';

describe('PopupCompileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopupCompileService]
    });
  });

  it('should be created', inject([PopupCompileService], (service: PopupCompileService) => {
    expect(service).toBeTruthy();
  }));
});

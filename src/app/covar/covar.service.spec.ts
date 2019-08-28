import { TestBed } from '@angular/core/testing';

import { CovarService } from './covar.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CovarService', () => {
  beforeEach(async() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule ],
    providers: [ CovarService ],
  }));

  it('should be created', () => {
    const service: CovarService = TestBed.get(CovarService);
    expect(service).toBeTruthy();
  });
});

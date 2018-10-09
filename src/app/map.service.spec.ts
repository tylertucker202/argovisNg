import { TestBed, inject } from '@angular/core/testing';
import { MapService } from './map.service';
import { ShapePopupComponent } from './shape-popup/shape-popup.component';
import { PopupCompileService } from './popup-compile.service';

describe('MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MapService, ShapePopupComponent, PopupCompileService]
    });
  });

  it('should be created', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));

  it('should properly transform shape', inject([MapService], (service: MapService) => {
    const shape1 = [[[ -64.511719, 26.588527 ], 
                   [ -64.511719, 37.020098 ],
                  ​​ [ -21.445312, 37.020098 ],
                   [ -21.445312, 26.588527 ],
                   [ -64.511719, 26.588527 ]]]

    const tShape1 = service.getTransformedShape(shape1)
    expect(tShape1).toBeTruthy();
    expect(tShape1).toEqual(shape1);


    const shape2 = [[[ -192.65625, 26.74561 ],
                    [ -192.65625, 37.300275 ],
                    [ -162.773438, 37.300275 ],
                    [ -162.773438, 26.74561 ],
                    [ -192.65625, 26.74561 ]]]
    const tShape2 = service.getTransformedShape(shape2)
    expect(tShape2).toBeTruthy();

    const eShape2 = [[[ 167.34375, 26.74561 ],
                    [ 167.34375, 37.300275 ],
                    [ -162.773438, 37.300275 ],
                    [ -162.773438, 26.74561 ],
                    [ 167.34375, 26.74561 ]]]
    expect(tShape2).toEqual(eShape2);

    const shape3 = [[[ 168.029119, 26.156804 ],
                    ​​[ 168.029119, 38.311739 ],
                    ​​[ 194.379895, 38.311739 ],
                    [ 194.379895, 26.156804 ],
                    ​​[ 168.029119, 26.156804 ]]]
    const tShape3 = service.getTransformedShape(shape3)
    const eShape3 = [[[ 168.029119, 26.156804 ],
                    ​[ 168.029119, 38.311739 ],
                    ​[ -165.620105, 38.311739 ],
                    ​[ -165.620105, 26.156804 ],
                    ​[ 168.029119, 26.156804 ]]]
    expect(tShape3).toEqual(eShape3);
  }));


});

import { TestBed, inject } from '@angular/core/testing';
import { MapService } from './map.service';
import { ShapePopupComponent } from '../shape-popup/shape-popup.component';
import { PopupCompileService } from './popup-compile.service';
import 'leaflet'
declare const L
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
    const shape1 = [[ 20.96144, -67.5 ],[ 26.74561, -63.105469 ],[ 19.145168, -62.226563 ],[ 20.96144, -67.5 ]]

    const eshape1 = [[[-67.5,20.96144],[-63.105469,26.74561],[-62.226563,19.145168],[-67.5,20.96144]]]

    const tShape1 = service.get_transformed_shape(shape1)
    expect(tShape1).toBeTruthy();
    expect(tShape1).toEqual(eshape1);


    const shape2 = [[ -192.65625, 26.74561 ],
                    [ -192.65625, 37.300275 ],
                    [ -162.773438, 37.300275 ],
                    [ -162.773438, 26.74561 ],
                    [ -192.65625, 26.74561 ]]
    const tShape2 = service.get_transformed_shape(shape2)
    expect(tShape2).toBeTruthy();

        const eShape2 = [[[ 26.74561,-192.65625 ],
                        [ 37.300275, -192.65625],
                        [ 37.300275, -162.773438 ],
                        [ 26.74561, -162.773438 ],
                        [ 26.74561, -192.65625 ]]]

    expect(tShape2).toEqual(eShape2);

    const shape3 = [[ 168.029119, 26.156804 ],
                    ​​[ 168.029119, 38.311739 ],
                    ​​[ 194.379895, 38.311739 ],
                    [ 194.379895, 26.156804 ],
                    ​​[ 168.029119, 26.156804 ]]
    const tShape3 = service.get_transformed_shape(shape3)
    const eShape3 = [[[ 26.156804, 168.029119 ],
                    ​[ 38.311739, 168.029119 ],
                    ​[ 38.311739, 194.379895 ],
                    ​[ 26.156804, 194.379895 ],
                    ​[ 26.156804, 168.029119 ]]]
    expect(tShape3).toEqual(eShape3);
  }));

  it('should create and add popup window to feature group',  inject([MapService], (service: MapService)=> {
    const shape2 = [[ -192.65625, 26.74561 ],
                    [ -192.65625, 37.300275 ],
                    [ -162.773438, 37.300275 ],
                    [ -162.773438, 26.74561 ],
                    [ -192.65625, 26.74561 ]]
    const latLngs = shape2.map( coord => {return L.latLng(coord[1], coord[1])})
    const lshape = L.polygon(latLngs)
    let fGroup = L.featureGroup()
    expect(fGroup.getLayers().length).toEqual(0)    
    service.popup_window_creation(lshape, fGroup)
    expect(fGroup.getLayers().length).toEqual(1)
  }))
});

import { TestBed } from '@angular/core/testing';
import { ArMapService } from './ar-map.service';
import { ShapePopupComponent } from '../home/shape-popup/shape-popup.component';
import { PopupCompileService } from '../home/services/popup-compile.service';
import 'leaflet'
declare const L

fdescribe('ArMapService', () => {
  let service: ArMapService
  let fGroup: L.FeatureGroup
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ArMapService, ShapePopupComponent, PopupCompileService]
    });
  service = TestBed.inject(ArMapService);
  fGroup = L.featureGroup()
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should create and add popup window to feature group', () => {
    const shape2 = [[ -192.65625, 26.74561 ],
                    [ -192.65625, 37.300275 ],
                    [ -162.773438, 37.300275 ],
                    [ -162.773438, 26.74561 ],
                    [ -192.65625, 26.74561 ]]
    const latLngs = shape2.map( coord => {return L.latLng(coord[1], coord[1])})
    const lshape = L.polygon(latLngs)
    expect(fGroup.getLayers().length).toEqual(0)    
    service.arPopupWindowCreation(lshape, fGroup)
    expect(fGroup.getLayers().length).toEqual(1)
  })
});

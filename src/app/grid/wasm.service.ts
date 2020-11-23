import { Injectable } from '@angular/core';
// import { add } from './../../ext-js/wasm/wasm-test/pkg/wasm_test'
@Injectable({
  providedIn: 'root'
})
export class WasmService {

  constructor() { 
    //TODO: find out how to work with karma tests
    import('./../../ext-js/wasm/wasm-test/pkg/wasm_test').then( x => this.add = x.add)
   }
  public add: Function
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WasmService {

  constructor() { 
    import('./../../ext-js/wasm/wasm-test/pkg/wasm_test').then( x => this.add = x.add)
   }
  public add: Function
}

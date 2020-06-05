import { Injectable } from '@angular/core';
// import init from './../../ext-js/wasm/wasm-test/pkg/wasm_test'
import { add } from './../../ext-js/wasm/wasm-test/pkg/wasm_test'
// import { Observable, BehaviorSubject } from 'rxjs'
// import { filter, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class WasmService {

  constructor() { }

  public add(a: number, b: number) {
    // Instantiate our wasm module
    // const wasm_test = await init("./pkg/wasm_test_bg.wasm");
  
    // Call the Add function export from wasm, save the result
    const addResult = add(a, b);
    console.log('wasm add result: ', addResult)
  };


}

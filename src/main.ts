import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
if (environment.production) {
  enableProdMode();
}

import("./app/app.module")
  .then(x => platformBrowserDynamic().bootstrapModule(x.AppModule))
  .catch(err => console.error(err));

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));
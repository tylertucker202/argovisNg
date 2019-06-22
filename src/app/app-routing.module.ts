import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GridComponent } from './grid/grid.component';

const appRoutes: Routes = [
    { path: 'ng/home',
      component: HomeComponent,
    },
    { path: 'ng',
    redirectTo: 'ng/home',
    pathMatch: 'full'
    },
    { path: '',
    redirectTo: 'ng/home',
    pathMatch: 'full'
    },
    { path: 'ng/grid',
      component: GridComponent,
    }
  ]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}

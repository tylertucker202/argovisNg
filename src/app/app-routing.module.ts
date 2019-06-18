import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GridComponent } from './grid/grid.component';

const appRoutes: Routes = [
    { path: 'home',
      component: HomeComponent,
    },
    { path: '',
    component: HomeComponent,
    //redirectTo: '/home',
    //pathMatch: 'full'
    },
    { path: 'grid',
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

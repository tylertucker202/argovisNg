import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArComponent } from './ar/ar.component'
import { ProfviewComponent } from './profview/profview.component'
import { GridComponent } from './grid/grid.component';
import { CovarComponent } from './covar/covar.component';

const appRoutes: Routes = [
    { path: 'ng/home',
      component: HomeComponent,
      data: {arModule: false}
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
    },
    { path: 'ng/covar',
      component: CovarComponent,
    }, 
    { path: 'ng/ar',
      component: HomeComponent,
      data: {arModule: true}
    },
    { path: 'ng/profview',
    component: ProfviewComponent,
    data: {arModule: true}
  }
  ]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}

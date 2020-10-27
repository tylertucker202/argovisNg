import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfviewComponent } from './profview/profview.component'
import { GridComponent } from './grid/grid.component';
import { CovarComponent } from './covar/covar.component';
import { ArComponent } from './ar/ar.component';
import { TcComponent } from './tc/tc.component';

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
    },
    { path: 'ng/covar',
      component: CovarComponent,
    }, 
    { path: 'ng/ar',
      component: ArComponent,
    },
    { path: 'ng/tc',
      component: TcComponent
    },
    { path: 'ng/profview',
    component: ProfviewComponent,
    }
  ]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}

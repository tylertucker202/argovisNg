import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutArgovisComponent } from './navbar/about-argovis/about-argovis.component'
import { FaqComponent } from './navbar/faq/faq.component'
import { ApiTutComponent } from './navbar/api-tut/api-tut.component'
import { GriddedClimComponent } from './navbar/gridded-clim/gridded-clim.component'


export const router: Routes = [
  {path: 'about-argovis', redirectTo: 'http://www.argo.ucsd.edu/Argovis_About.html', pathMatch: 'full'},
  {path: 'faq', component: FaqComponent},
  {path: 'api-tut', component: ApiTutComponent},
  {path: 'gridded-clim', component: GriddedClimComponent},
  //{path: '', redirectTo: '/map', pathMatch: 'full'}
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      router,
      { enableTracing: true } // <-- debugging purposes only
    )
    // other imports here
  ]
})
export class AppRoutingModule { }

//export const routes: ModuleWithProviders = RouterModule.forRoot(router);
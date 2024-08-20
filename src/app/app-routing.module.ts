import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/features/auth/auth.module').then(m => m.AuthModule),
    // canActivate: [AuthGuard],
  },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('src/app/dashboard/dashboard.module').then(m => m.DashboardModule),
  // },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

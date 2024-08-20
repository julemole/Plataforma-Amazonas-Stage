import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HeaderUnauthComponent } from './components/header-unauth/header-unauth.component';
import { ContainerUnauthComponent } from './components/container-unauth/container-unauth.component';

@NgModule({
  declarations: [
    HeaderUnauthComponent,
    ContainerUnauthComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderUnauthComponent,
    ContainerUnauthComponent,
  ]
})

export class SharedModule { }

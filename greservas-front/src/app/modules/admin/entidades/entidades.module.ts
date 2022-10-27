import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntidadesRoutingModule } from './entidades-routing.module';
import { EntidadesComponent } from './entidades.component';
//import { ClienteComponent } from './cliente/cliente.component';

@NgModule({
  declarations: [
    EntidadesComponent,
    //ClienteComponent
  ],
  imports: [
    CommonModule,
    EntidadesRoutingModule
  ]
})
export class EntidadesModule { }

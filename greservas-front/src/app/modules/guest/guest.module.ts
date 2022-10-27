import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';
import { MainFooterComponent } from '../admin/components/footer/main-footer/main-footer.component';
import { MainHeaderComponent } from '../admin/components/header/main-header/main-header.component';
import { AdminModule } from '../admin/admin.module';





@NgModule({
  declarations: [
    GuestComponent
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    AdminModule
  ]
})
export class GuestModule { }

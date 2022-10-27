import { NgModule } from '@angular/core';
import { WebSharedModule } from '../../my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from '../../my-shared/modules/material-shared/material-shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { MainHeaderComponent } from './components/header/main-header/main-header.component';
import { MainFooterComponent } from './components/footer/main-footer/main-footer.component';


@NgModule({
  declarations: [
    AdminComponent,
    MainHeaderComponent,
    MainFooterComponent
  ],
  imports: [
    WebSharedModule,
    MaterialSharedModule,
    AdminRoutingModule
  ],
  exports: [ 
    MainHeaderComponent, 
    MainFooterComponent
  ]
})
export class AdminModule { }

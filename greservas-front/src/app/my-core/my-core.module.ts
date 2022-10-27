import { NgModule, Optional, SkipSelf } from '@angular/core';


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { ApiCrudService } from './services/api-crud.service';
import { LoginService } from './services/login.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorPtIntl } from './services/paginator-pt-intl';




@NgModule({
  providers: [

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorPtIntl
    },
    ApiCrudService,
    LoginService

  ]
})
export class MyCoreModule {

  constructor(@Optional() @SkipSelf() parentModule: MyCoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }

 }


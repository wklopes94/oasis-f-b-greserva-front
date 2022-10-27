import { NgModule } from '@angular/core';
import { WebSharedModule } from '../../../../my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from '../../../../my-shared/modules/material-shared/material-shared.module';
import { ComponentsSharedModule } from '../../../../my-shared/modules/components-shared/components-shared.module';

import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ListarComponent } from './components/crud/listar/listar.component';
import { ApagarComponent } from './components/crud/apagar/apagar.component';
import { CriaralterarComponent } from './components/crud/criaralterar/criaralterar.component';
import { DetalheComponent } from './components/crud/detalhe/detalhe.component';
import { ExtrasComponent } from './extras.component';
import { ExtrasRoutingModule } from './extras-routing.module';




@NgModule({
  declarations: [
    ExtrasComponent,
    MainMenuComponent,
    ListarComponent,
    ApagarComponent,
    CriaralterarComponent,
    DetalheComponent
  ],
  imports: [
    WebSharedModule,
    MaterialSharedModule,
    ComponentsSharedModule,
    ExtrasRoutingModule
  ]
})
export class ExtrasModule { }

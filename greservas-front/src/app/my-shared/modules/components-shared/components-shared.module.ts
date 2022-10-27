import { NgModule } from '@angular/core';

import { WebSharedModule } from '../web-shared/web-shared.module';
import { MaterialSharedModule } from '../material-shared/material-shared.module';

import { PaginaNaoEncontradoComponent } from './pagina-nao-encontrado/pagina-nao-encontrado.component';
import { DialogoConfirmacaoComponent } from './dialogo-confirmacao/dialogo-confirmacao.component';
import { InicioComponent } from './inicio/inicio.component';




@NgModule({
  declarations: [
    PaginaNaoEncontradoComponent,
    DialogoConfirmacaoComponent,
    InicioComponent
  ],
  imports: [
    WebSharedModule,
    MaterialSharedModule
  ],
  exports: [
    PaginaNaoEncontradoComponent,
    DialogoConfirmacaoComponent,
    InicioComponent
  ],
  entryComponents: [DialogoConfirmacaoComponent]
})
export class ComponentsSharedModule { }

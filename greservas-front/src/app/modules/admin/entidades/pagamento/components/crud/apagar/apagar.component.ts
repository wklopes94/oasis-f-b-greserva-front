import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PagamentoCrudService } from '../../../services/pagamento-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  id: any;
}

@Component({
  selector: 'app-apagar',
  templateUrl: './apagar.component.html',
  styleUrls: ['./apagar.component.scss'],
  providers: [
    PagamentoCrudService
  ]
})
export class ApagarComponent implements OnInit {

  erroMsg?: string;
  hasErroMsg: boolean = false;
  requestCompleto= false;

  constructor(private pagamentoCrudService: PagamentoCrudService,
                      private router: Router,
                      public dialogRef: MatDialogRef<ListarComponent>,
                      @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
  }

  apagar(): void {
    console.log("APAGAR PAGAMENTO!!!!!!----> ", + this.data.id);
    this.pagamentoCrudService.deleteData(this.data.id).subscribe(
      success => {
        alert('PAGAMENTO APAGADO COM: sucesso: ' + success);        
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/pagamento/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO PAGAMENTO: Erro no Create PAGAMENTO \n"+error;
        this.requestCompleto = false;
        alert(this.erroMsg);
      },
      () => {
        console.log('APAGAR PAGAMENTO: request completo');
        this.requestCompleto = true;
      }
    );    
  }

  cancelar(): void{
    alert("Cancelar Operacao!!!!!!");
    this.dialogRef.close();
    this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
      this.router.navigate(['/oa-admin/gestao/entidades/pagamento/listar']);
    });
  }


}

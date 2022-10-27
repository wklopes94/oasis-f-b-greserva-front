import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExtrasCrudService } from '../../../services/extras-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  id: any;
}

@Component({
  selector: 'app-apagar',
  templateUrl: './apagar.component.html',
  styleUrls: ['./apagar.component.scss'],
  providers: [
    ExtrasCrudService
  ]
})
export class ApagarComponent implements OnInit {

  erroMsg?: string;
  hasErroMsg: boolean = false;
  requestCompleto= false;

  constructor(private extraCrudService: ExtrasCrudService,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
  }

  apagar(): void {
    console.log("APAGAR EXTRA!!!!!!----> ", + this.data.id);
    this.extraCrudService.deleteData(this.data.id).subscribe(
      success => {
        alert('EXTRA APAGADO COM: sucesso: ' + success);        
        //fechar o dialog pop-up
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/extras/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "APAGAR EXTRA: Erro no Create EXTRA \n"+error;
        this.requestCompleto = false;
        //console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('APAGAR EXTRA: request completo');
        this.requestCompleto = true;
      }
    );
    
  }

  cancelar(): void{
    alert("Cancelar Operacao!!!!!!");
    this.dialogRef.close();
    this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
      this.router.navigate(['/oa-admin/gestao/entidades/extras/listar']);
    });
  }

}

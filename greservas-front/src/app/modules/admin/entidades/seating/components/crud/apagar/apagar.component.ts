import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SeatingCrudService } from '../../../services/seating-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  id: any;
}

@Component({
  selector: 'app-apagar',
  templateUrl: './apagar.component.html',
  styleUrls: ['./apagar.component.scss'],
  providers: [
    SeatingCrudService
  ]
})
export class ApagarComponent implements OnInit {

  erroMsg?: string;
  hasErroMsg: boolean = false;
  requestCompleto= false;

  constructor(private seatingCrudService: SeatingCrudService,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
  }

  apagar(): void {
    console.log("APAGAR SEATING!!!!!!----> ", + this.data.id);
    this.seatingCrudService.deleteData(this.data.id).subscribe(
      success => {
        alert('SEATING APAGADO COM: sucesso: ' + success);        
        //fechar o dialog pop-up
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/seating/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO ITEM: Erro no Create SEATING \n"+error;
        this.requestCompleto = false;
        //console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('APAGAR SEATING: request completo');
        this.requestCompleto = true;
      }
    );
    
  }

  cancelar(): void{
    alert("Cancelar Operacao!!!!!!");
    //this.router.navigate(["./oa-admin/gestao/entidades/estado/listar"]);

    this.dialogRef.close();
    this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
      this.router.navigate(['/oa-admin/gestao/entidades/seating/listar']);
    });
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestauranteCrudService } from '../../../services/restaurante-crud.service';
import { ListarComponent } from '../listar/listar.component';

export interface Parametros {
  id: any;
}

@Component({
  selector: 'app-apagar',
  templateUrl: './apagar.component.html',
  styleUrls: ['./apagar.component.scss'],
  providers: [
    RestauranteCrudService
  ]
})export class ApagarComponent implements OnInit {

  erroMsg?: string;
  hasErroMsg: boolean = false;
  requestCompleto= false;

  constructor(private restauranteCrudService: RestauranteCrudService,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Parametros) { }

  ngOnInit(): void {
  }

  apagar(): void {
    console.log("APAGAR ESTADO!!!!!!----> ", + this.data.id);
    this.restauranteCrudService.deleteData(this.data.id).subscribe(
      success => {
        alert('RESTAURANTE APAGADO COM: sucesso: ' + success);        
        //fechar o dialog pop-up
        this.dialogRef.close();
        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/restaurante/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO RESTAURANTE: Erro no Create RESTAURANTE \n"+error;
        this.requestCompleto = false;
        //console.log(this.erroMsg);
        alert(this.erroMsg);
      },
      () => {
        console.log('APAGAR RESTAURANTE: request completo');
        this.requestCompleto = true;
      }
    );
    
  }

  cancelar(): void{
    this.dialogRef.close();
    this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
      this.router.navigate(['/oa-admin/gestao/entidades/restaurante/listar']);
    });
  }

}

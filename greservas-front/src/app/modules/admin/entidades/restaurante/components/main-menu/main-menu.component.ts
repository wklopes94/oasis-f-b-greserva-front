import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IRestaurante } from '../../interfaces/i-restaurante';
import { CriaralterarComponent } from '../crud/criaralterar/criaralterar.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(private router: Router, private dialog : MatDialog) {}

  ngOnInit(): void {}

  openDialog(acaoRestaurante: string) {
    console.log("Metodo para Criar restaurante");
    let dados!: IRestaurante;
    
    const dialogRef = this.dialog.open(CriaralterarComponent, {
                                       width: '60%',
                                       data: {
                                            acao: acaoRestaurante,
                                            restaurante: dados,
                                       }
                      });
    
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`)
    });
  }

  navegarParaListarConjunto(){
    //console.log("Metodo para Listar restaurante");
    this.router.navigate(["./oa-admin/gestao/entidades/restaurante/listar"])
  }
  
}
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IMenu } from '../../interfaces/i-menu';
import { CriaralterarComponent } from '../crud/criaralterar/criaralterar.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(private router: Router, private dialog : MatDialog) {}

  ngOnInit(): void {}

  openDialog(acaoMenu: string) {
    console.log("Metodo para Criar MENU");
    let dados!: IMenu;
    
    const dialogRef = this.dialog.open(CriaralterarComponent, {
                                       width: '60%',
                                       data: {
                                            acao: acaoMenu,
                                            menu: dados,
                                       }
                      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)

    });
  }

  navegarParaListarConjunto(){
    this.router.navigate(["./oa-admin/gestao/entidades/menu/listar"])
  }
}
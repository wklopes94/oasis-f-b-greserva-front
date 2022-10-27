import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CriaralterarComponent } from '../crud/criaralterar/criaralterar.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(private router: Router, private dialog : MatDialog) {}

  ngOnInit(): void {}

  openDialog() {
    const dialogRef = this.dialog.open(CriaralterarComponent, {
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  navegarParaListarConjunto(){
    this.router.navigate(["./oa-admin/gestao/entidades/grupo/listar"])
  }
}
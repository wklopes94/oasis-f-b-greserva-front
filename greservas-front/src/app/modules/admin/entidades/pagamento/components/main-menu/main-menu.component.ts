import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IPagamento } from '../../interfaces/i-pagamento';
import { CriaralterarComponent } from '../crud/criaralterar/criaralterar.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  constructor(private router: Router, private dialog : MatDialog) {}

  ngOnInit(): void {}

  openDialog(acaoEstado: string) {
    console.log("Metodo para Criar PAGAMENTO");
    let dados!: IPagamento;
    
    const dialogRef = this.dialog.open(CriaralterarComponent, {
                                       width: '60%',
                                       data: {
                                            acao: acaoEstado,
                                            estado: dados,
                                       }
                      });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)

    });
  }

  navegarParaListarConjunto(): void{
    console.log("Metodo para Listar PAGAMENTOS");
    this.router.navigate(["./oa-admin/gestao/entidades/pagamento/listar"])
  }
}

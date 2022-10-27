import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IMyPages } from 'src/app/my-shared/interfaces-shared/i-my-pages';
import { IResponsePageableRestaurante } from '../../../interfaces/i-response-pageable-restaurante';
import { IRestaurante } from '../../../interfaces/i-restaurante';
import { RestauranteCrudService } from '../../../services/restaurante-crud.service';
import { ApagarComponent } from '../apagar/apagar.component';
import { CriaralterarComponent } from '../criaralterar/criaralterar.component';

export interface Parametros {
  acao: 'criar' | 'ver' | 'editar';
  restaurante: IRestaurante;
}

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    RestauranteCrudService
  ]
})export class ListarComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome','lotacaoMaxima', 'dataCriacao', 'dataUltimaActualizacao', 'ativo', 'acoes'];
  dataSource: IRestaurante[] = [];

  erroMsg?: string;
  haErroMsg: boolean = false;
  requestCompleto = false;

  carregando: boolean = false;

  //PAGINAÇÃO
  mypages?: IMyPages;


  totalElements: number =0;
  sizeInicial: number =3;
  sort: string ="nome";
  direccaoOrdem: string ="asc";

  pageSizeOptions: number[] = [1, 2, 5, 10];

  //PAGE_EVENT
  pageEvent?: PageEvent;

  //SORT_EVENT
  sortEvent?: Sort;
  

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  //-----FORM PESQUISA
  submitted = false;

  //CRIAR FORMULARIO
  formPesquisa: FormGroup = this.formBuilder.group({
    nome: [null],
    activo: [true]
  });
  
  constructor(private formBuilder: FormBuilder, 
              private restauranteCrudService: RestauranteCrudService,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.readAll();
  }

  

  //ONSUBMIT
  onSubmit() {
    this.submitted = true;
    this.readAll();
  }
  readAll() {
    //PAGINAÇÃO
    this.carregando = true;
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
     let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
    
    //SORT
    this.sort = this.sortEvent? this.sortEvent.active : "nome";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservablePesquisa$: Observable<IResponsePageableRestaurante>;

    myObservablePesquisa$ = this.restauranteCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);

    myObservablePesquisa$.subscribe(
      (data: IResponsePageableRestaurante) => {
        this.dataSource = data._embedded.restaurantes;
        this.mypages = data.page;
        this.totalElements = this.mypages.totalElements;
        this.carregando = false;
      },
      error => {
        this.erroMsg = error;
        this.haErroMsg = true;
        console.error('ERROR: ', error);
      },
      () => { this.requestCompleto = true; }
    );
    
  }

  openDialog(acaoRestaurante: string, dados: IRestaurante): void{
    const dialogRef = this.dialog.open(CriaralterarComponent,  {
                                        width: '60%',
                                        data: {
                                          acao: acaoRestaurante,
                                          restaurante: dados,
                                        }
                      });    
    dialogRef.afterClosed().subscribe(result => {});
  }

  apagarEstado(idE: number): void{
    const dialogRef = this.dialog.open(ApagarComponent, {
                                        width: '40%',
                                        height: '40%',
                                        data: {
                                          id: idE
                                        }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  limparPesquisa() {
    this.submitted = false;
    this.formPesquisa.reset();
  }

}

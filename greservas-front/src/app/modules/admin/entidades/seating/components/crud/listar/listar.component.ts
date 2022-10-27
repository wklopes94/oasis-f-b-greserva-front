import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IMyPages } from 'src/app/my-shared/interfaces-shared/i-my-pages';
import { IReqSeating } from '../../../interfaces/i-req-seating';
import { IResponsePageableSeating } from '../../../interfaces/i-response-pageable-seating';
import { ISeating } from '../../../interfaces/i-seating';
import { SeatingCrudService } from '../../../services/seating-crud.service';
import { ApagarComponent } from '../apagar/apagar.component';
import { CriaralterarComponent } from '../criaralterar/criaralterar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    SeatingCrudService
  ]
})export class ListarComponent implements OnInit {

  displayedColumns: string[] = ['id', 'horaInicio','horaFim', 'completo', 'ativo','dataCriacao', 'dataUltimaActualizacao','acoes'];
  dataSource: ISeating[] = [];
  erroMsg?: string;
  haErroMsg: boolean = false;
  requestCompleto = false;
  carregando: boolean = false;
  //PAGINAÇÃO
  mypages?: IMyPages;
  totalElements: number =0;
  sizeInicial: number =10;
  sort: string ="horaInicio";
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
              private seatingCrudService: SeatingCrudService,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.readAll();
  }

  readAll(): void {
    this.carregando = true;
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    console.log('--> ' + pageIndex);
    let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
    console.log('--> ' + pageSize);
    //SORT
    this.sort = this.sortEvent? this.sortEvent.active : "horaInicio";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservablePesquisa$: Observable<IResponsePageableSeating>;

    myObservablePesquisa$ = this.seatingCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);

    myObservablePesquisa$.subscribe(
      (data: IResponsePageableSeating) => {
        console.log('Foi lido os seguintes dados, Seating: ', data._embedded.seatings);
        this.dataSource = data._embedded.seatings;
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

  openDialog(acaoSeating: string, dados: ISeating): void{
    const dialogRef = this.dialog.open(CriaralterarComponent,  {
                                        width: '60%',
                                        data: {
                                          acao: acaoSeating,
                                          seating: dados,
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

  //ONSUBMIT
  onSubmit() {
    this.submitted = true;
    this.readAll();
  }

  limparPesquisa() {
    this.submitted = false;
    this.formPesquisa.reset();
  }

}
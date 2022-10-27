import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IMyPages } from 'src/app/my-shared/interfaces-shared/i-my-pages';
import { IExtras } from '../../../interfaces/i-extras';
import { IResponsePageableExtras } from '../../../interfaces/i-response-pageable-extras';
import { ExtrasCrudService } from '../../../services/extras-crud.service';
import { ApagarComponent } from '../apagar/apagar.component';
import { CriaralterarComponent } from '../criaralterar/criaralterar.component';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    ExtrasCrudService
  ]
})
export class ListarComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome','descricao', 'dataCriacao', 'dataUltimaActualizacao', 'ativo', 'acoes'];
  dataSource: IExtras[] = [];
  erroMsg?: string;
  haErroMsg: boolean = false;
  requestCompleto = false;
  carregando: boolean = false;
  //PAGINAÇÃO
  mypages?: IMyPages;
  totalElements: number =0;
  sizeInicial: number =10;
  sort: string ="nome";
  direccaoOrdem: string ="asc";
  pageSizeOptions: number[] = [1, 2, 5, 10];
  //PAGE_EVENT
  pageEvent?: PageEvent;
  //SORT_EVENT
  sortEvent?: Sort;
  //-----FORM PESQUISA
  submitted = false;
  //CRIAR FORMULARIO
  formPesquisa: FormGroup = this.formBuilder.group({
    nome: [null],
    activo: [true]
  });
  
  constructor(private formBuilder: FormBuilder, 
              private extrasCrudService: ExtrasCrudService,
              private dialog : MatDialog) { }

  ngOnInit(): void {
    this.readAll();
  } 

  readAll(){
    this.carregando = true;
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    console.log('--> ' + pageIndex);
    let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
    console.log('--> ' + pageSize);
    this.sort = this.sortEvent? this.sortEvent.active : "nome";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservablePesquisa$: Observable<IResponsePageableExtras>;
    myObservablePesquisa$ = this.extrasCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);
    myObservablePesquisa$.subscribe(
      (data: IResponsePageableExtras) => {
        console.log('Foi lido os seguintes dados, Extras: ', data._embedded.extras);
        this.dataSource = data._embedded.extras;
        this.mypages = data.page;
        this.totalElements = this.mypages.totalElements;
        this.carregando = false;
      },
      (error: string | undefined) => {
        this.erroMsg = error;
        this.haErroMsg = true;
        console.error('ERROR: ', error);
      },
      () => { this.requestCompleto = true; }
    );
    
  }


  openDialog(acaoExtra: string, dados: IExtras): void{
    const dialogRef = this.dialog.open(CriaralterarComponent,  {
                                        width: '60%',
                                        data: {
                                          acao: acaoExtra,
                                          extra: dados,
                                        }
                      });    
    dialogRef.afterClosed().subscribe(result => {});
  }

  apagarExtra(idE: number): void{
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

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

}

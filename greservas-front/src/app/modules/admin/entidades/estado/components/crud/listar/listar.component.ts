import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IMyPages } from 'src/app/my-shared/interfaces-shared/i-my-pages';
import { IEstado } from '../../../interfaces/i-estado';
import { IResponsePageableEstado } from '../../../interfaces/i-response-pageable-estado';
import { EstadoCrudService } from '../../../services/estado-crud.service';
import { ApagarComponent } from '../apagar/apagar.component';
import { CriaralterarComponent } from '../criaralterar/criaralterar.component';


@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    EstadoCrudService
  ]
})
export class ListarComponent implements OnInit {

  displayedColumns: string[] = ['id', 'valor','descricao', 'ativo', 'acoes'];
  dataSource: IEstado[] = [];
  erroMsg?: string;
  haErroMsg: boolean = false;
  requestCompleto = false;
  carregando: boolean = false;
  
  mypages?: IMyPages;
  totalElements: number =0;
  sizeInicial: number =10;
  sort: string ="valor";
  direccaoOrdem: string ="asc";
  pageSizeOptions: number[] = [1, 2, 5, 10];
  pageEvent?: PageEvent;
  sortEvent?: Sort;  

  submitted = false;
  formPesquisa: FormGroup = this.formBuilder.group({
    nome: [null],
    activo: [true]
  });

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  
  constructor(private formBuilder: FormBuilder, 
              private estadoCrudService: EstadoCrudService,
              private dialog : MatDialog) { }

  ngOnInit(): void {    
    this.readAll();
  }

  readAll(){
    this.carregando = true;
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;    
    this.sort = this.sortEvent? this.sortEvent.active : "valor";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";
    let myObservablePesquisa$: Observable<IResponsePageableEstado>;
    myObservablePesquisa$ = this.estadoCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);
    myObservablePesquisa$.subscribe(
      (data: IResponsePageableEstado) => {
        this.dataSource = data._embedded.estados;
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

  onSubmit() {
    this.submitted = true;
    this.readAll();
  }

  limparPesquisa() {
    this.submitted = false;
    this.formPesquisa.reset();
  }

  openDialog(acaoEstado: string, dados: IEstado): void{
    const dialogRef = this.dialog.open(CriaralterarComponent,  {
                                        width: '60%',
                                        data: {
                                          acao: acaoEstado,
                                          estado: dados,
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

}
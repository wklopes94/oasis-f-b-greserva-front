import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IMyPages } from 'src/app/my-shared/interfaces-shared/i-my-pages';
import { MCliente } from '../../../../cliente/models/m-cliente';
import { ClienteCrudService } from '../../../../cliente/services/cliente-crud.service';
import { IParticular } from '../../../interfaces/i-particular';
import { IResponsePageableParticular } from '../../../interfaces/i-response-pageable-particular';
import { ParticularCrudService } from '../../../services/particular-crud.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    ClienteCrudService,
    ParticularCrudService
  ]
})
export class ListarComponent implements OnInit {

  displayedColumns: string[] = ['nomeCliente', 'apelidoCliente','email', 'telefone', 'observacao', 'ativo','acoes'];
  dataSource: IParticular[] = [];

  erroMsg?: string;
  haErroMsg: boolean = false;
  requestCompleto = false;

  carregando: boolean = false;

  //PAGINAÇÃO
  mypages?: IMyPages;


  totalElements: number =0;
  sizeInicial: number =3;
  sort: string ="nomeCliente";
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
      private particularCrudService: ParticularCrudService, 
      private clienteCrudService: ClienteCrudService, ){

    }

    ngOnInit(): void {
      this.readAll();
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

    readAll(){
      console.log("No read all ....");
      //PAGINAÇÃO
      this.carregando = true;
      let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
      console.log('--> ' + pageIndex);
      let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
      console.log('--> ' + pageSize);
  
      //SORT
      this.sort = this.sortEvent? this.sortEvent.active : "nomeCliente";
      this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";
  
      let myObservablePesquisa$: Observable<IResponsePageableParticular>;
  
      myObservablePesquisa$ = this.particularCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);
  
      myObservablePesquisa$.subscribe(
        (data: IResponsePageableParticular) => {
          console.log('Foi lido os seguintes dados, item: ', data._embedded.particulares);
          this.dataSource = data._embedded.particulares;
          this.mypages = data.page;
          this.totalElements = this.mypages.totalElements;
          this.carregando = false;
          
          this.dataSource.forEach((elem) => {
                  console.log("Elem--> " + elem._links.cliente.href);
                  
                  let myObservablePesquisa1$: Observable<MCliente>;
  
                  myObservablePesquisa1$ = this.clienteCrudService.getDataByURL(elem._links.cliente.href);
                  myObservablePesquisa1$.subscribe(
                          (data1: MCliente) => {
                                  console.log('Foi lido os seguintes dados, CLIENTES: ', data1.nome);
                                  elem.nomeCliente = data1.nome;
                                  elem.apelidoCliente = data1.apelido;
                                  elem.email = data1.email;
                                  elem.telefone = data1.telefone;
                                  elem.ativo = data1.ativo;
  
                          },
                          error => {
                            this.erroMsg = error;
                            this.haErroMsg = true;
                            console.error('Erro ', error);
                          },
                          () => {this.requestCompleto = true; }
                  );
  
  
          });
  
        },
        error => {
          this.erroMsg = error;
          this.haErroMsg = true;
          console.error('ERROR: ', error);
        },
        () => { this.requestCompleto = true; }
      );
      
    }

}

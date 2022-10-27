import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { IMyPages } from 'src/app/my-shared/interfaces-shared/i-my-pages';
import { MRestaurante } from '../../../../restaurante/models/m-restaurante';
import { RestauranteCrudService } from '../../../../restaurante/services/restaurante-crud.service';
import { MSeating } from '../../../../seating/models/m-seating';
import { SeatingCrudService } from '../../../../seating/services/seating-crud.service';
import { IResponsePageableRestauranteSeating } from '../../../interfaces/i-response-pageable-restaurante-seating';
import { IRestauranteSeating } from '../../../interfaces/i-restaurante-seating';
import { RestauranteSeatingCrudService } from '../../../services/restaurante-seating-crud.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    RestauranteSeatingCrudService,
    RestauranteCrudService,
    SeatingCrudService
  ]
})
export class ListarComponent implements OnInit {

  displayedColumns: string[] = ['data', 'lotacao','restaurante', 'horaInicio', 'horaFim', 'completo', 'ativo', 'acoes'];
  dataSource: IRestauranteSeating[] = [];

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
    private restauranteSeatingCrudService: RestauranteSeatingCrudService, 
    private restauranteCrudService: RestauranteCrudService,
    private seatingCrudService: SeatingCrudService, ){

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
    this.carregando = true;
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
    
    //SORT
    this.sort = this.sortEvent? this.sortEvent.active : "horaInicio";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservablePesquisa$: Observable<IResponsePageableRestauranteSeating>;

    myObservablePesquisa$ = this.restauranteSeatingCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);

    myObservablePesquisa$.subscribe(
      (data: IResponsePageableRestauranteSeating) => {
        this.dataSource = data._embedded.restaurante_seating;
        this.mypages = data.page;
        this.totalElements = this.mypages.totalElements;
        this.carregando = false; 
        
        this.dataSource.forEach((elem) => {
          let myObservablePesquisa1$: Observable<MRestaurante>;
          myObservablePesquisa1$ = this.restauranteCrudService.getDataByURL(elem._links.restaurante.href);
          myObservablePesquisa1$.subscribe(
                  (data1: MRestaurante) => {
                         elem.restaurante = data1.nome;
                  },
                  error => {
                    this.erroMsg = error;
                    this.haErroMsg = true;
                    console.error('Erro ', error);
                  },
                  () => {this.requestCompleto = true; }
          );

          let myObservablePesquisa2$: Observable<MSeating>;

          myObservablePesquisa2$ = this.seatingCrudService.getDataByURL(elem._links.seating.href);
          myObservablePesquisa2$.subscribe(
                  (data2: MSeating) => {
                          elem.horaInicio = data2.horaInicio;
                          elem.horaFim = data2.horaFim;
                          elem.completo = data2.completo;
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

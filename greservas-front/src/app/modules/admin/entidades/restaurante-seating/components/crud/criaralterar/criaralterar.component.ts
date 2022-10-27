import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IMyPages } from 'src/app/my-shared/interfaces-shared/i-my-pages';
import { IMenu } from '../../../../menu/interfaces/i-menu';
import { IResponsePageableMenu } from '../../../../menu/interfaces/i-response-pageable-menu';
import { MMenu } from '../../../../menu/models/m-menu';
import { MenuCrudService } from '../../../../menu/services/menu-crud.service';
import { IResponsePageableRestaurante } from '../../../../restaurante/interfaces/i-response-pageable-restaurante';
import { IRestaurante } from '../../../../restaurante/interfaces/i-restaurante';
import { RestauranteCrudService } from '../../../../restaurante/services/restaurante-crud.service';
import { IResponsePageableSeating } from '../../../../seating/interfaces/i-response-pageable-seating';
import { ISeating } from '../../../../seating/interfaces/i-seating';
import { SeatingCrudService } from '../../../../seating/services/seating-crud.service';
import { IReqRestauranteSeating } from '../../../interfaces/i-req-restaurante-seating';
import { RestauranteSeatingCrudService } from '../../../services/restaurante-seating-crud.service';
import { ListarComponent } from '../listar/listar.component';

@Component({
  selector: 'app-criaralterar',
  templateUrl: './criaralterar.component.html',
  styleUrls: ['./criaralterar.component.scss'],
  providers: [
    RestauranteSeatingCrudService,
    RestauranteCrudService,
    SeatingCrudService,
    MenuCrudService
  ]
})
export class CriaralterarComponent implements OnInit {
  acao = "criar";
  formCriarAlterarRestauranteSeating!: FormGroup;
  menuFormControl = new FormControl('');
  requestCompleto = false;
  erroMsg?: string;
  haErroMsg: boolean = false;
  mypages?: IMyPages;
  //PAGE_EVENT
  pageEvent?: PageEvent;
  //SORT_EVENT
  sortEvent?: Sort;
  sizeInicial: number =30;
  sort: string ="id";
  direccaoOrdem: string ="asc";

  dataSourceRestaurante: IRestaurante[] = [];
  dataSourceSeating: ISeating[] = [];
  dataSourceMenu!: IMenu[];
  hasErroMsg: boolean = false;
  totalElements: number =0;
  


  constructor(private restauranteSeatingCrudService: RestauranteSeatingCrudService,
              private restauranteCrudService: RestauranteCrudService,
              private seatingCrudService: SeatingCrudService,
              private menuCrudService: MenuCrudService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private router: Router,
              public dialogRef: MatDialogRef<ListarComponent>) { }

  ngOnInit(): void {
    this.carregarRestaurantes();
    this.carregarSeatings();
    this.carregarMenus();

    this.preencherFormulario();
  }


  preencherFormulario() {
    console.log("PREENCHER fORMULARIO");
    //LER DADOS URL: SABER ID e ACCAO
    this.route.params.subscribe((params: any) =>{
      console.log(params);
      const id = params['id'];
      if(id){
        this.preencherFormularioUpdate(id);
      }else{
        this.preencherFormularioCreate();
      }
    });
  }

  //CARREGAR FORM COM DADOS DE OBJECTO
  preencherFormularioUpdate(id: number): void {
    console.log('Preencher Formulario para Update Pagamento com ID:  ' + id);
  }


  //INCIALIZAR FORM COM DADOS PARA CRIAR
  preencherFormularioCreate(): void {
    this.acao="criar";
    console.log("ACCAO: ", this.acao);
    this.incializarFormRestauranteSeating();
   }

   incializarFormRestauranteSeating(): void {
    this.formCriarAlterarRestauranteSeating = this.formBuilder.group({
      id: [null],
      restaurante: [null, [Validators.required]],
      seating: [null, [Validators.required]],
      data: [null, [Validators.required]],
      lotacao: [null, [Validators.required]],
      menu: [null, [Validators.required]],
      ativo: [null],
      dataCriacao: [null],
      dataAtualizacao: [null]
    });
  }


  carregarMenus() {
    console.log('CARREGAR LISTA DE MENUS');
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
    
    this.sort = this.sortEvent? this.sortEvent.active : "id";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservablePesquisa$: Observable<IResponsePageableMenu>;

    myObservablePesquisa$ = this.menuCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);

    myObservablePesquisa$.subscribe(
      (data: IResponsePageableMenu) => {
        this.dataSourceMenu = data._embedded.menus;
        this.mypages = data.page;
        this.totalElements = this.mypages.totalElements;
        //this.carregando = false;
      },
      error => {
        this.erroMsg = error;
        this.haErroMsg = true;
        console.error('ERROR: ', error);
        this.dataSourceMenu = [];
      },
      () => { this.requestCompleto = true; }
    );
  }


  carregarSeatings() {
    console.log('CARREGAR LISTA DE SEATINGS');
    
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
    
    this.sort = this.sortEvent? this.sortEvent.active : "id";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservablePesquisa$: Observable<IResponsePageableSeating>;

    myObservablePesquisa$ = this.seatingCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);

    myObservablePesquisa$.subscribe(
      (data: IResponsePageableSeating) => {
        this.dataSourceSeating = data._embedded.seatings;
        this.mypages = data.page;
        this.totalElements = this.mypages.totalElements;
        //this.carregando = false;
      },
      error => {
        this.erroMsg = error;
        this.haErroMsg = true;
        console.error('ERROR: ', error);
        this.dataSourceSeating = [];
      },
      () => { this.requestCompleto = true; }
    );
  }


  carregarRestaurantes() {
    console.log('CARREGAR LISTA DE RESTAURANTES');
    //PAGINAÇÃO
    //this.carregando = true;
    let pageIndex = this.pageEvent? this.pageEvent.pageIndex: 0;
    let pageSize = this.pageEvent? this.pageEvent.pageSize: this.sizeInicial;
    
    //SORT
    this.sort = this.sortEvent? this.sortEvent.active : "id";
    this.direccaoOrdem = this.sortEvent? this.sortEvent.direction : "asc";

    let myObservablePesquisa$: Observable<IResponsePageableRestaurante>;

    myObservablePesquisa$ = this.restauranteCrudService.findAll(pageIndex, pageSize, this.sort, this.direccaoOrdem);

    myObservablePesquisa$.subscribe(
      (data: IResponsePageableRestaurante) => {
        this.dataSourceRestaurante = data._embedded.restaurantes;
        //console.log("Lista de Restaurantes--->" + this.dataSourceRestaurante[1].id);
        //this.dataSourceRestaurante.forEach( (rest) => {console.log("REST---> " + rest.id);});
        this.mypages = data.page;
        this.totalElements = this.mypages.totalElements;
        //this.carregando = false;
      },
      error => {
        this.erroMsg = error;
        this.haErroMsg = true;
        console.error('ERROR: ', error);
        this.dataSourceRestaurante = [];
      },
      () => { this.requestCompleto = true; }
    );
  }



  addRestauranteSeating(){
    console.log("ADICIONAR UM RestauranteSeating SEATING");
    console.log('estou aqui..... ' + JSON.stringify(this.criarObjectoRestauranteSeating()));

    this.restauranteSeatingCrudService.createRestauranteSeatingFromIReqRestauranteSeating(this.criarObjectoRestauranteSeating()).subscribe(
      success => {
        console.log('CRIADO RestauranteSeating: sucesso: ' + success);
        alert('RestauranteSeating criado com Sucesso: ' + success);

        //fechar o dialog pop-up
        this.dialogRef.close();

        this.router.navigateByUrl('/', {skipLocationChange: true} ).then(() => {
          this.router.navigate(['/oa-admin/gestao/entidades/restaurante-seating/listar']);
        });
      },
      error => {
        this.hasErroMsg = true;
        this.erroMsg = "CRIADO RestauranteSeating: Erro no Create RESTAURANTE SEATING \n"+error;
        this.requestCompleto = false;
        console.log(this.erroMsg);
        alert(this.erroMsg);
      },

      () => {
        console.log('CRIAR RESTAURANTE SEATING: request completo');
        this.requestCompleto = true;
      }
    );
  }
  


  criarObjectoRestauranteSeating(): IReqRestauranteSeating{
    console.log('CRIANDO OBJECTO RESSEAT......');
    //console.log('Menu List---> ' + this.formCriarAlterarRestauranteSeating?.value.menu);
    return {
      "id": this.formCriarAlterarRestauranteSeating?.value.id,
      "data": this.formCriarAlterarRestauranteSeating?.value.data,
      "lotacao": this.formCriarAlterarRestauranteSeating?.value.lotacao,
      "ativo": this.formCriarAlterarRestauranteSeating?.value.ativo,
      "dataCriacao": this.getDataCriacao(),
      "dataUltimaActualizacao": this.getDataActualizacao(),

      "seating": 'http://localhost:8080/seatings/' + this.formCriarAlterarRestauranteSeating?.value.seating,
      "restaurante": 'http://localhost:8080/restaurantes/' + this.formCriarAlterarRestauranteSeating?.value.restaurante,
      "menu": 'http://localhost:8080/menus/' + this.formCriarAlterarRestauranteSeating?.value.menu
     }
  }

  resetFields(){
    this.formCriarAlterarRestauranteSeating.reset();
    alert('CLEAN FIELDS');
  }

  //passado ou presente
  getDataCriacao(): string {
    return '2022-10-11T12:10:00'
  }

  //futoro ou presente
  getDataActualizacao(): string {
    return '2022-12-10T23:10:00'
  }

}

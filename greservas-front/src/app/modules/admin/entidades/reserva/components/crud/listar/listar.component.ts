import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IReserva } from '../../../interfaces/i-reserva';
import { ReservaCrudService } from '../../../services/reserva-crud.service';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { CriaralterarComponent } from '../criaralterar/criaralterar.component';
import { DetalheComponent } from '../detalhe/detalhe.component';
import { ApagarComponent } from '../apagar/apagar.component';
import { ClienteCrudService } from '../../../../cliente/services/cliente-crud.service';
import { RestauranteSeatingCrudService } from '../../../../restaurante-seating/services/restaurante-seating-crud.service';
import { RestauranteCrudService } from '../../../../restaurante/services/restaurante-crud.service';
import { SeatingCrudService } from '../../../../seating/services/seating-crud.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    ReservaCrudService,
    ClienteCrudService,
    RestauranteSeatingCrudService,
    RestauranteCrudService,
    SeatingCrudService
  ]
})


export class ListarComponent implements OnInit {

  page = 0;
  size = 20;
  sort_item = 'dataReserva';
  ordem = 'desc';

  resultado: any = [];
  reservas! : IReserva[];
  resDataSource = new MatTableDataSource<IReserva>();  
  displayedColumns: string[] = ['dataReserva', 'nomeRest', 'dataInitSeat', 'nomeCliente', 'apelidoCliente', 'tipoCliente', 'ativo', 'estado', 'actions'];
  searchKey = "";

  filterObj = {};

  @ViewChild(MatSort) sort = new MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
    
  constructor(public reservaCrudService: ReservaCrudService, 
              public clienteCrudService: ClienteCrudService,
              public restauranteSeatingCrudService: RestauranteSeatingCrudService,
              public restauranteCrudService: RestauranteCrudService,
              public seatingCrudService: SeatingCrudService,
              private router: Router, 
              private dialog : MatDialog) {
   }

  ngOnInit(): void {     
    this.carregarReservas();    
  }
  
  carregarReservas() {
    return this.reservaCrudService.findAll(this.page,this.size, this.sort_item, this.ordem).subscribe((data: {}) => {
          
          this.resultado = data;
          this.reservas = this.resultado._embedded.reservas;     
          
          this.reservas.forEach( (elem) =>{
            return this.clienteCrudService.getDataByURL(elem._links.cliente.href).subscribe((cli: {}) => {
              let cliente = JSON.stringify(cli);

              elem.nomeCliente = JSON.parse(cliente).nome;
              elem.apelidoCliente = JSON.parse(cliente).apelido;
              elem.tipoCliente = JSON.parse(cliente).tipo;

              return this.restauranteSeatingCrudService.getDataByURL(elem._links.restauranteSeating.href).subscribe((rst: {}) => {
                let resSeat = JSON.stringify(rst);
                
                    return this.restauranteCrudService.getDataByURL(JSON.parse(resSeat)._links.restaurante.href).subscribe((rest: {}) => {
                      let restaur = JSON.stringify(rest);
                      elem.nomeRest = JSON.parse(restaur).nome;

                        return this.seatingCrudService.getDataByURL(JSON.parse(resSeat)._links.seating.href).subscribe((seat: {}) => {
                          let seating = JSON.stringify(seat);
                          elem.dataInitSeat = JSON.parse(seating).horaInicio;
                        });

                    });
                
              });
              
            });

          });
          this.resDataSource =  new MatTableDataSource(this.reservas);
          this.resDataSource.sort = this.sort;
          this.resDataSource.paginator = this.paginator;          
    });    
  }

  onSearchClear(){
    this.searchKey = "";
    this.applyFilter(this.searchKey, "");
  }

  applyFilter(filterValue: string, key: string){
    this.filterObj = {
      value: filterValue.trim().toLowerCase(),
      key: key
    }
    this.resDataSource.filter = filterValue;
    if (this.resDataSource.paginator) {
        this.resDataSource.paginator.firstPage();
    }
  }

  

  verDetalhesReserva(){
      const dialogRef = this.dialog.open(DetalheComponent, {
          width: '30%'
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
  }

  editarReserva(){    
    const dialogRef = this.dialog.open(CriaralterarComponent, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  apagarReserva(){    
    const dialogRef = this.dialog.open(ApagarComponent, {
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }  

}
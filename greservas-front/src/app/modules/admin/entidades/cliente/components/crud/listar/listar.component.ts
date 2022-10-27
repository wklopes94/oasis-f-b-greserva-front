import { ChangeDetectorRef, Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import { ICliente } from '../../../interfaces/i-cliente';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ClienteCrudService } from '../../../services/cliente-crud.service';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss'],
  providers: [
    ClienteCrudService
  ]
})
export class ListarComponent implements OnInit {

  page = 0;
  size = 40;
  sort_item = 'id';
  ordem = 'desc';

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  displayedColumns: string[] = ['id', 'tipo', 'nome', 'apelido', 'email', 'telefone', 'ativo', 'actions'];
  
  resultado: any = [];
  clientes: ICliente[] = [];
  cliDataSource = new MatTableDataSource<ICliente>();  

  searchKey = "";
  filterObj = {};

  @ViewChild(MatSort) sort = new MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  
  constructor(private clienteCrudService: ClienteCrudService,){}

  carregarClientes() {        
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
          merge(this.sort.sortChange, this.paginator.page)
          .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return this.clienteCrudService.findAll(this.page,this.size, this.sort_item, this.ordem).pipe(catchError(() => observableOf(null)));
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              this.isRateLimitReached = data === null;

              if (data === null) {
                return [];
              }
              // Only refresh the result length if there is new data. In case of rate
              // limit errors, we do not want to reset the paginator to zero, as that
              // would prevent users from re-triggering requests.
              this.resultsLength = data.total_count;
              return data._embedded.clientes;
            }),
          )
          .subscribe(data => {
                                this.clientes = data;
                                this.cliDataSource =  new MatTableDataSource(this.clientes);
                                this.cliDataSource.sort = this.sort;
                                this.cliDataSource.paginator = this.paginator;  
                             });
           
    }  
    
    ngOnInit(): void {     
      this.carregarClientes();    
    }  

    novoCliente(){
        console.log('CRIANDO UM NOVO CLIENTE');  
    }

    verDetalhesCliente(){
      console.log("ver detalhe de uma cliente()");
    }

    editarCliente(){
      console.log("Editar uma cliente()");
    }

    apagarCliente(){
      console.log("Apagar uma cliente()");
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
      this.cliDataSource.filter = filterValue;
      if (this.cliDataSource.paginator) {
          this.cliDataSource.paginator.firstPage();
      }
  }

}


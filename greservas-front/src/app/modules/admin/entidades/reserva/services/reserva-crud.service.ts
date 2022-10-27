import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/internal/Observable';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { MReserva } from '../models/m-reserva';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take, tap, delay } from 'rxjs/operators';
//import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';

//import { ApiCrudService } from '../../../../../my-core/services/api-crud.service';
//import { MReserva } from '../models/m-reserva';
import { IResponsePageableReserva } from '../interfaces/i-response-pageable-reserva';


@Injectable({
  providedIn: 'root'
})
export class ReservaCrudService extends ApiCrudService<MReserva>{

  constructor(protected override  http: HttpClient) {
    super(http, "reservas");
  }


  findAll(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableReserva> {

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${super.getAPIURL}?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http.get<IResponsePageableReserva>(url, {headers: super.getheaders}).pipe(
      delay(2000),
      take(1),
      catchError(this.errorMgmt));
  }

  createReservaFromIReqReserva(record: any){
    /*console.log('Extra CRUD Service::::CRIAR EXTRA!!!   ' + record);
    console.log('Extra CRUD Service::::CRIAR EXTRA!!!   ' + record.nome);
    console.log('Extra CRUD Service::::CRIAR EXTRA!!!   ' + record.dataCriacao);
    console.log('Extra CRUD Service::::CRIAR EXTRA!!!   ' + record.dataUltimaActualizacao);
    */
   let url = `${super.getAPIURL}`;
    console.log("URL++++++++++++++ " +url);

    return this.http.post(url, record,  { headers: super.getheaders })
      .pipe(
        take(1), //depois da resposta ele faz unsubscribe automaticamente
        catchError(this.errorMgmt)
      );
  }

  
}

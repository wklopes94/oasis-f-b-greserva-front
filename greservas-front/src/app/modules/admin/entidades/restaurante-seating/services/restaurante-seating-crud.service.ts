import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { IResponsePageableRestauranteSeating } from '../interfaces/i-response-pageable-restaurante-seating';
import { MRestauranteSeating } from '../models/m-restaurante-seating';
import { take, delay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RestauranteSeatingCrudService extends ApiCrudService<MRestauranteSeating>{
  createRestauranteSeatingFromIReqExtra(arg0: any) {
    throw new Error('Method not implemented.');
  }

  constructor(protected override  http: HttpClient) {
    super(http, "restauranteSeating");
   }

   findAll(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableRestauranteSeating> {

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${super.getAPIURL}?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http.get<IResponsePageableRestauranteSeating>(url, {headers: super.getheaders}).pipe(
      delay(2000),
      take(1),
      catchError(this.errorMgmt));
  }

  createRestauranteSeatingFromIReqRestauranteSeating(record: any){
    console.log('RESSEAT CRUD Service::::CRIAR RESSEAT!!!   ' + record);
    console.log('RESSEAT CRUD Service::::CRIAR RESSEAT!!!   ' + record.data);
    console.log('RESSEAT CRUD Service::::CRIAR RESSEAT!!!   ' + record.dataCriacao);
    console.log('RESSEAT CRUD Service::::CRIAR RESSEAT!!!   ' + record.dataUltimaActualizacao);
    let url = `${super.getAPIURL}`;
    console.log("URL++++++++++++++ " +url);

    return this.http.post(url, record,  { headers: super.getheaders })
      .pipe(
        take(1), //depois da resposta ele faz unsubscribe automaticamente
        catchError(this.errorMgmt)
      );
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { IResponsePageableEstado } from '../interfaces/i-response-pageable-estado';
import { MEstado } from '../models/m-estado';
import { take, delay, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EstadoCrudService extends ApiCrudService<MEstado>{

  constructor(protected override  http: HttpClient) {
    super(http, "estados");
   }

   findAll(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableEstado> {

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${super.getAPIURL}?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http.get<IResponsePageableEstado>(url, {headers: super.getheaders}).pipe(
      delay(2000),
      take(1),
      catchError(this.errorMgmt));
  }

  createExtraFromIReqEstado(record: any){
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

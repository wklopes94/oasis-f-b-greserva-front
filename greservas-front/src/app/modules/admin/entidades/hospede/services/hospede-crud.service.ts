import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCrudService } from 'src/app/my-core/services/api-crud.service';
import { take, delay, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IResponsePageableHospede } from '../interfaces/i-response-pageable-hospede';
import { MHospede } from '../models/m-hospede';

@Injectable({
  providedIn: 'root'
})
export class HospedeCrudService extends ApiCrudService<MHospede>{

  constructor(protected override  http: HttpClient) {
    super(http, "hospedes");
   }

   findAll(page: number, size: number, sort: string, ordem: string): Observable<IResponsePageableHospede> {

    //http://localhost:8686/xxxxxx?page=0&size=2&sort=nome,asc

    let url = `${super.getAPIURL}?page=${page}&size=${size}&sort=${sort},${ordem}`;
    return this.http.get<IResponsePageableHospede>(url, {headers: super.getheaders}).pipe(
      delay(2000),
      take(1),
      catchError(this.errorMgmt));
  }

  createHospedeFromIReqHospede(record: any){
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
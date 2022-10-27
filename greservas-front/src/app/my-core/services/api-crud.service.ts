import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take, tap, delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MEstado } from 'src/app/modules/admin/entidades/estado/models/m-estado';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'responseType': 'text'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiCrudService<T> {
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin','*');
  private  API_URL: String;

  get getheaders(): any {
    return this.headers;
  }

  get getAPIURL(): any {
    return this.API_URL;
  }

  constructor(protected  http: HttpClient, private URI: String) {
        this.API_URL = environment.API+URI;
  }

  // Create
  createData(record: T) {
    let url = `${this.API_URL}`;
    return this.http.post(url, record,  { headers: this.headers })
      .pipe(
        take(1), //depois da resposta ele faz unsubscribe automaticamente
        catchError(this.errorMgmt)
      );
  }

  // Get all Data
  //getAllData(): Observable<T[]> {
    getAllData(): Observable<T[]> {
    //console.log('GET ALL DATA URL: ', this.API_URL);
    return this.http.get<T[]>( `${this.API_URL}`).pipe(
      //delay(2000), //para remover em produção
      take(1), // com isso já não é preciso fazer unsubscribe
      catchError(this.errorMgmt)
    );
    /*
    .pipe(
      tap(console.log)
    );*/
  }

  // Get all Data by URL
  getDataByURL(url: string): Observable<T> {
    return this.http.get<T>(url, {headers: this.headers}).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }

  // Get Data
  getData(id: number): Observable<T> {
    let url = `${this.API_URL}/${id}`;
    return this.http.get<T>(url, {headers: this.headers}).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }


  // Update Data
  updateData(id: number, record: T): Observable<T> {
    
    /*console.log("CRUD Service||||||||||||||||||||||||||");
    console.log("ID Recebido: " + id);*/

    /*console.log("Informacao do Estado a Actualizar::::::::::::");
    console.log("VALOR: " + record.valor);
    console.log("DESCRICAO: " + record.descricao);
    console.log("ATIVO: " + record.ativo);
    console.log("DATA CRIACAO: " + record.dataCriacao);
    console.log("DATA ATUALIZACAO: " + record.dataUltimaActualizacao);*/   
    
    
    let url = `${this.API_URL}/${id}`;
    return this.http.put<T>(url, record, { headers: this.headers }).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }

  // Delete Data
  deleteData(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    }

    let url = `${this.API_URL}/${id}`;
    return this.http.delete<void>(url, requestOptions).pipe(
      take(1),
      catchError(this.errorMgmt)
    );
  }


  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from '../app/constants';

@Injectable()
export class ServicoService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(private _http: Http) {
  }

  public findMapServico(limiteDados) {
    try {

      return new Promise((resolve, reject) => {
        let tokenUsuario = localStorage.getItem(Constants.TOKEN_USUARIO) ? localStorage.getItem(Constants.TOKEN_USUARIO) : '';
        this._http.post(Constants.API_URL + 'findMapServico/'
          + tokenUsuario, JSON.stringify(limiteDados), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  
}

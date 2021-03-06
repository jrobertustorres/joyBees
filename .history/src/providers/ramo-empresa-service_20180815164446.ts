import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Constants } from '../app/constants';

@Injectable()
export class RamoEmpresaService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(private _http: Http) {
  }

  public findAllRamoEmpresaAtivo() {
    try {

      return new Promise((resolve, reject) => {
        this._http.post(Constants.API_URL + 'findAllRamoEmpresaAtivo/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
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

  public findUsuarioRamoSelecionado() {
    try {

      return new Promise((resolve, reject) => {
        this._http.post(Constants.API_URL + 'findUsuarioRamoSelecionado/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
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

  public saveUsuarioRamoSelecionado(listaUsuarioRamoEmpresaEntity) {
    try {

      // this.UsuarioRamoEmpresaEntity = new UsuarioRamoEmpresaEntity();

      return new Promise((resolve, reject) => {
        this._http.post(Constants.API_URL + 'saveUsuarioRamoSelecionado/'
        + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(listaUsuarioRamoEmpresaEntity), this.options)
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

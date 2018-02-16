import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Constants } from '../app/constants';

@Injectable()
export class VagaService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public urlServico: string;

  constructor(public http: Http, 
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController) {
  }

  public getVagasHome() {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL  + 'findVagaByVaga/', this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            // reject(err.json());
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public getVagasPrincipal() {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL  + 'findVagaByVaga/'+ 
        localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            // reject(err.json());
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findVagaDetalhe(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'findDetalheVagaByIdVaga/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            // reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findVagasCandidatadas() {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'findVagaCandidatarByVagaUsuario/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            // reject(err.json());
          });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public callCandidatarVaga(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL  + 'candidatarVaga/'+ 
        localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            // reject(err.json());
          });
      });
      
    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

}


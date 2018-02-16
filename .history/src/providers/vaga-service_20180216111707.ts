import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Storage } from '@ionic/storage';

import { NativeStorage } from '@ionic-native/native-storage';

import { Constants } from '../app/constants';

@Injectable()
export class VagaService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public urlServico: string;

  constructor(public http: Http, 
              public alertCtrl: AlertController, 
              private nativeStorage: NativeStorage,
              private _storage: Storage,
              public loadingCtrl: LoadingController) {
  }

  public getVagasHome() {
    try {

      return new Promise((resolve, reject) => {
        // this.http.post(Constants.API_URL  + 'findVagaByVaga/', this.options)
        this.http.post(Constants.API_URL  + 'findVagaDestaqueByVaga/', this.options)
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

  public getVagasPrincipal(filtro) {
    try {

      return new Promise((resolve, reject) => {
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          console.log(tokenUsuario);
          this.http.post(Constants.API_URL  + 'findVagaByVaga/'
          + tokenUsuario, JSON.stringify(filtro), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
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
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this.http.post(Constants.API_URL + 'findDetalheVagaByIdVaga/'
            + tokenUsuario, JSON.stringify(idVaga), this.options)
            .map(res=>res.json())
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              // reject(err.json());
            });
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
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
        this.http.post(Constants.API_URL + 'findVagaCandidatarByVagaUsuario/'
          + this.nativeStorage.getItem(Constants.TOKEN_USUARIO), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
          }, (err) => {
            // reject(err.json());
          });
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
        this.nativeStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
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

  public callDescartarVaga(idVaga) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL  + 'descandidatarVaga/'+ 
        this.nativeStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(idVaga), this.options)
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


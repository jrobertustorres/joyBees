import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';

import { Storage } from '@ionic/storage';

import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class LoginService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public userChangeEvent = new EventEmitter();
  public emailPessoaChangeEvent = new EventEmitter();

  constructor(public http: Http,
              private nativeStorage: NativeStorage,
              private _storage: Storage) {
  }

  public login(usuarioEntity) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'login/', JSON.stringify(usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            this._storage.set(Constants.ID_USUARIO, data.idUsuario);
            this._storage.set(Constants.TOKEN_USUARIO, data.token);
            this._storage.set(Constants.NOME_PESSOA, data.nomePessoa);
            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            // localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            // localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.login);
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

  public loginByIdService(usuarioEntity) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'loginById/', JSON.stringify(usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            console.log(data);
            this._storage.set(Constants.ID_USUARIO, data.idUsuario);
            this._storage.set(Constants.TOKEN_USUARIO, data.token);
            this._storage.set(Constants.NOME_PESSOA, data.nomePessoa);
            data.idiomaUsuario = data.idiomaUsuario == 'Português' ? 'pt-br' : 'en';
            localStorage.setItem(Constants.IDIOMA_USUARIO, data.idiomaUsuario);
            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            // localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            // localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.login);
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


import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';

@Injectable()
export class LoginService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public userChangeEvent = new EventEmitter();
  public emailPessoaChangeEvent = new EventEmitter();

  constructor(public http: Http) {
  }

  public login(usuarioEntity) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'login/', JSON.stringify(usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            localStorage.setItem('idUsuarioLogado', data.idUsuario);
            localStorage.setItem('nomePessoa', data.nomePessoa);
            this.userChangeEvent.emit(data.nomePessoa);
            this.emailPessoaChangeEvent.emit(data.login);
            console.log(data);
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
            localStorage.setItem('idUsuarioLogado', data.idUsuario);
            localStorage.setItem('nomePessoa', data.nomePessoa);
            this.userChangeEvent.emit(data.nomePessoa);
            this.tipoUsuarioChangeEvent.emit(data.tipoUsuario);
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


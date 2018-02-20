import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class LoginService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public userChangeEvent = new EventEmitter();
  public emailPessoaChangeEvent = new EventEmitter();

  constructor(public http: Http,
              private nativeStorage: NativeStorage) {
  }

  public login(usuarioEntity) {
    try {

      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'login/', JSON.stringify(usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            // this.nativeStorage.setItem(Constants.ID_USUARIO, {idUsuario: data.idUsuario});
            // this.nativeStorage.setItem(Constants.NOME_PESSOA, {nomePessoa: data.nomePessoa});

            // console.log('dentro do value 2222');
            // this.nativeStorage.getItem(Constants.ID_USUARIO).then(function (value) {
            //   console.log('dentro do value 2222');
            //   console.log(value);
            // }, function (error) {
            //   console.log(error);
            // });
            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
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

            this.nativeStorage.setItem(Constants.ID_USUARIO, {idUsuario: data.idUsuario});
            this.nativeStorage.setItem(Constants.NOME_PESSOA, {nomePessoa: data.nomePessoa});
            // this.nativeStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            // this.nativeStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
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

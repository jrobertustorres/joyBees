import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';

// import { Storage } from '@ionic/storage';

//ENTITYS
import { UsuarioEntity } from '../model/usuario-entity';

@Injectable()
export class LoginService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public userChangeEvent = new EventEmitter();
  public emailPessoaChangeEvent = new EventEmitter();
  private usuarioEntity: UsuarioEntity;

  constructor(public http: Http) {
  }

  public login(usuarioEntity) {
    try {

      this.usuarioEntity = new UsuarioEntity();
      this.usuarioEntity = usuarioEntity;
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'login/', JSON.stringify(this.usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            data.idiomaUsuario = data.idiomaUsuario == 'Português' ? 'pt-br' : 'en';

            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            localStorage.setItem(Constants.CAMERA_DATA, data.imagemPessoaBs64);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO, data.isCadastroCompleto);
            localStorage.setItem(Constants.IDIOMA_USUARIO, data.idiomaUsuario);

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
      this.usuarioEntity = new UsuarioEntity();
      this.usuarioEntity = usuarioEntity;
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      return new Promise((resolve, reject) => {
        this.http.post(Constants.API_URL + 'loginById/', JSON.stringify(usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);
            data.idiomaUsuario = data.idiomaUsuario == 'Português' ? 'pt-br' : 'en';

            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            localStorage.setItem(Constants.CAMERA_DATA, data.imagemPessoaBs64);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO, data.isCadastroCompleto);
            localStorage.setItem(Constants.IDIOMA_USUARIO, data.idiomaUsuario);

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

  public loginFacebook(usuarioEntity) {
    try {

      this.usuarioEntity = new UsuarioEntity();
      this.usuarioEntity = usuarioEntity;
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);
      this.usuarioEntity.versaoApp = localStorage.getItem(Constants.VERSION_NUMBER);
      return new Promise((resolve, reject) => {
        console.log(usuarioEntity);
        this.http.post(Constants.API_URL + 'loginByIdFacebook/', JSON.stringify(this.usuarioEntity), this.options)
          .map(res=>res.json())
          .subscribe(data => {
            resolve(data);

            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.TOKEN_USUARIO, data.token);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            localStorage.setItem(Constants.CAMERA_DATA, data.imagemPessoaBs64);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO, data.isCadastroCompleto);
            localStorage.setItem(Constants.IDIOMA_USUARIO, data.idiomaUsuario);

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


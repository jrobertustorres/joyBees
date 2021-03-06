import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Constants } from '../app/constants';

//ENTITYS
import { UsuarioEntity } from '../model/usuario-entity';

@Injectable()
export class UsuarioService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  private usuarioEntity: UsuarioEntity;
  public userChangeEvent = new EventEmitter();
  public emailPessoaChangeEvent = new EventEmitter();
  public tipoUsuarioChangeEvent = new EventEmitter();

  // private _token: number;

  constructor(public _http: Http) {
  }

  public adicionaUsuarioBasico(usuarioEntity) {
    try {

      this.usuarioEntity = new UsuarioEntity();
      this.usuarioEntity = usuarioEntity;
      // this.usuarioEntity.tokenPush = localStorage.getItem('tokenPush');
      this.usuarioEntity.tokenPush = localStorage.getItem(Constants.TOKEN_PUSH);

      return new Promise((resolve, reject) => {

        this._http.post(Constants.API_URL + 'adicionaUsuarioBasico/', JSON.stringify(this.usuarioEntity), this.options)
          .map(function (res) { return res.json(); })
          .subscribe(data => {
            resolve(data);
            // this._storage.set(Constants.ID_USUARIO, data.idUsuario);
            // this._storage.set(Constants.NOME_PESSOA, data.nomePessoa);
            // this._storage.set(Constants.IS_CADASTRO_COMPLETO, data.isCadastroCompleto);

            localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
            localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_VAGA, data.isCadastroCompletoVaga);
            localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_SERVICO, data.isCadastroCompletoServico);

            this.userChangeEvent.emit(data.nomePessoa);
            // this.tipoUsuarioChangeEvent.emit(data.tipoUsuario);
            // this.qtdTicketFornecedorChangeEvent.emit(data.qtdTicketFornecedor);
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

  public cadastraImagemUsuario(usuarioEntity) {
    try {

      return new Promise((resolve, reject) => {
        // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this._http.post(Constants.API_URL + 'adicionaImagemUsuario/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(usuarioEntity), this.options)
            .map(function (res) { return res.json(); })
            .subscribe(data => {
              resolve(data);
            }, (err) => {
              reject(err.json());
            });
        // });
      });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  // public getDadosUsuario() {
  //   try {

  //     return new Promise((resolve, reject) => {
  //       this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
  //         this._http.post(Constants.API_URL + 'findDadosUsuario/'
  //         + tokenUsuario, this.options)
  //           .subscribe(data => {
  //             resolve(data);
  //           }, (err) => {
  //             // reject(err.json());
  //           });
  //       });
  //     });

  //   } catch (e){
  //     if(e instanceof RangeError){
  //       console.log('out of range');
  //     }
  //   }
  // }

  public getDadosUsuario() {
    try {
      // this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
      //   console.log(tokenUsuario);
      //   localStorage.setItem(Constants.TOKEN_USUARIO, tokenUsuario);
      // });
      return this._http.post(Constants.API_URL + 'findDadosUsuario/'
        + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
        .map(res => res.json())
        .toPromise()
        .catch();
      // });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findEndereco() {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'findEndereco/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
            .map(function (res) { return res.json(); })
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

  public alteraEndereco(enderecoEntity) {
    try {

      return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'alteraEndereco/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(enderecoEntity), this.options)
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

  public atualizaUsuario(usuarioDetalheEntity) {
      try {
  
        // let salarioFormat = this.dadosUsuarioForm.value.salario.replace(",", "");
        // usuarioDetalheEntity.salario = salarioFormat;
  
        return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'editaUsuario/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(usuarioDetalheEntity), this.options)
            .map(function (res) { return res.json(); })
            .subscribe(data => {
              resolve(data);

              localStorage.setItem(Constants.ID_USUARIO, data.idUsuario);
              localStorage.setItem(Constants.NOME_PESSOA, data.nomePessoa);
              localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_VAGA, data.isCadastroCompletoVaga);
              localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_SERVICO, data.isCadastroCompletoServico);

              this.userChangeEvent.emit(usuarioDetalheEntity.nomePessoa);
              this.emailPessoaChangeEvent.emit(usuarioDetalheEntity.emailUsuario);
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

  public atualizaSenhaUsuario(usuarioEntity) {
      try {
  
        this.usuarioEntity = new UsuarioEntity();
  
        return new Promise((resolve, reject) => {
          this._http.post(Constants.API_URL + 'alteraSenhaUsuario/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(usuarioEntity), this.options)
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

  public recuperasenhaService(usuarioEntity) {
    try {

      this.usuarioEntity = new UsuarioEntity();
      return new Promise((resolve, reject) => {
        this._http.post(Constants.API_URL + 'recuperaSenha/', JSON.stringify(usuarioEntity), this.options)
          .map(function (res) { return res.json(); })
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
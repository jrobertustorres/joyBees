import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Constants } from '../app/constants';
import { Storage } from '@ionic/storage';

//ENTITYS
import { UsuarioEntity } from '../model/usuario-entity';

@Injectable()
export class UsuarioService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  private usuarioEntity: UsuarioEntity;
  public userChangeEvent = new EventEmitter();
  public tipoUsuarioChangeEvent = new EventEmitter();

  constructor(public _http: Http,
              private _storage: Storage) {
  }

  public cadastraUsuario(usuarioEntity) {
    try {

      this.usuarioEntity = new UsuarioEntity();

      return new Promise((resolve, reject) => {

        this._http.post(Constants.API_URL + 'adicionaUsuario/', JSON.stringify(usuarioEntity), this.options)
          .map(function (res) { return res.json(); })
          .subscribe(data => {
            resolve(data);
            // this.nativeStorage.setItem('idUsuarioLogado', data.idUsuario);
            // this.nativeStorage.setItem('nomePessoa', data.nomePessoa);
            this.userChangeEvent.emit(data.nomePessoa);
            // this.tipoUsuarioChangeEvent.emit(data.tipoUsuario);
            // this.qtdTicketFornecedorChangeEvent.emit(data.qtdTicketFornecedor);
            // this.nativeStorage.setItem('previousPage', 'MeusDadosPage');
            console.log(data);
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
        this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
          this._http.post(Constants.API_URL + 'adicionaImagemUsuario/'
          + tokenUsuario, JSON.stringify(usuarioEntity), this.options)
            .map(function (res) { return res.json(); })
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
        return this._http.post(Constants.API_URL + 'findDadosUsuario/'
          + tokenUsuario, this.options)
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

    public atualizaUsuario(usuarioEntity) {
        try {
    
          // this.usuarioEntity = new UsuarioEntity();
    
          return new Promise((resolve, reject) => {
            this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
              this._http.post(Constants.API_URL + 'editaUsuario/'
              + tokenUsuario, JSON.stringify(usuarioEntity), this.options)
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

  public atualizaSenhaUsuario(usuarioEntity) {
      try {
  
        this.usuarioEntity = new UsuarioEntity();
  
        return new Promise((resolve, reject) => {
          this._storage.get(Constants.TOKEN_USUARIO).then((tokenUsuario) => {
            this._http.post(Constants.API_URL + 'alteraSenhaUsuario/'
            + tokenUsuario, JSON.stringify(usuarioEntity), this.options)
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

  public recuperasenhaService(usuarioEntity) {
    try {

      this.usuarioEntity = new UsuarioEntity();
      return new Promise((resolve, reject) => {
        this._http.post(Constants.API_URL + 'recuperaSenha/', JSON.stringify(usuarioEntity), this.options)
          .map(function (res) { return res.json(); })
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
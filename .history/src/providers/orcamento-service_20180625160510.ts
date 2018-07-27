import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Constants } from '../app/constants';

@Injectable()
export class OrcamentoService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });

  constructor(public _http: Http) {
  }

  public findServicoOrcamentoByStatus(detalheOrcamentoEntity) {
    try {

      return this._http.post(Constants.API_URL + 'findServicoOrcamentoByStatus/'
        + localStorage.getItem(Constants.TOKEN_USUARIO),
        JSON.stringify(detalheOrcamentoEntity), this.options)
        .map(res => res.json())
        .toPromise()
        .catch();

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public detalhaOrcamentoByUsuario (cotacaoEntity) {
    try {

      return this._http.post(Constants.API_URL + 'detalhaOrcamentoByUsuario/'
        + localStorage.getItem(Constants.TOKEN_USUARIO),
        JSON.stringify(cotacaoEntity), this.options)
        .map(res => res.json())
        .toPromise()
        .catch();

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public findCockpitCotacaoByUsuario() {
    try {

      return this._http.post(Constants.API_URL + 'findCockpitCotacaoByUsuario/'
        + localStorage.getItem(Constants.TOKEN_USUARIO), this.options)
        .map(res => res.json())
        .toPromise()
        .catch();

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  public lancarOrcamentoServico(orcamentoEntity) {
    try {

      return new Promise((resolve, reject) => {
        this._http.post(Constants.API_URL + 'lancarOrcamentoServico/'
          + localStorage.getItem(Constants.TOKEN_USUARIO), JSON.stringify(orcamentoEntity), this.options)
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

  // public confirmarPedido(cotacaoFornecedorEntity) {
  //   try {

  //     return this._http.post(Constants.API_URL + 'confirmarPedido/'
  //       + localStorage.getItem(Constants.TOKEN_USUARIO),
  //       JSON.stringify(cotacaoFornecedorEntity), this.options)
  //       .map(res => res.json())
  //       .toPromise()
  //       .catch();

  //   } catch (e){
  //     if(e instanceof RangeError){
  //       console.log('out of range');
  //     }
  //   }
  // }

  // public rejeitarPedido (cotacaoFornecedorEntity) {
  //   try {

  //     return this._http.post(Constants.API_URL + 'rejeitarPedido/'
  //       + localStorage.getItem(Constants.TOKEN_USUARIO),
  //       JSON.stringify(cotacaoFornecedorEntity), this.options)
  //       .map(res => res.json())
  //       .toPromise()
  //       .catch();

  //   } catch (e){
  //     if(e instanceof RangeError){
  //       console.log('out of range');
  //     }
  //   }
  // }

}
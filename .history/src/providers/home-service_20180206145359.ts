import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/toPromise';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Constants } from '../app/constants';

@Injectable()
export class HomeService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  public urlServico: string;

  constructor(public http: Http, 
              public alertCtrl: AlertController, 
              public loadingCtrl: LoadingController) {
  }

  public getDadosCockpitHome() {
    try {

      if (localStorage.getItem(Constants.TIPO_USUARIO_SELECIONADO) == null || 
          localStorage.getItem(Constants.TIPO_USUARIO_SELECIONADO) == 'fornecedor') {
          this.urlServico = 'findCockpitFornecedor/';
      } else {
        this.urlServico = 'findCockpitUsuarioTipoServico/';
      }
      
      return this.http.post(Constants.API_URL + this.urlServico
        + localStorage.getItem(Constants.TOKEN_USUARIO).trim(), this.options)
      .map(res => res.json())
      .toPromise()
      .catch();

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

}


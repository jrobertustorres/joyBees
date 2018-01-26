import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
import { Constants } from '../app/constants';
// import { NavParams } from 'ionic-angular';

//ENTITY
import { EstadoEntity } from '../model/estado-entity';

//SERVICES
// import { EstadosBrService } from '../providers/estados-service';

@Injectable()
export class CidadesService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  private estadoEntity: EstadoEntity;
  // private idEstado: number;

  constructor(public _http: Http) {
    // this.idEstado = number;
    // this.idEstado = this.navParams.get('idEstado');
  }

  public getCidades(idEstado) {
  // public getCidades() {
    // this.estado.idEstado = this.idEstado;
    this.estadoEntity = new EstadoEntity();
    this.estadoEntity.idEstado = idEstado;
    try {

      return this._http.post(Constants.API_URL + 'findCidadeByEstado/', 
        JSON.stringify(this.estadoEntity), this.options)
        .map(res => res.json())
        .toPromise()
        .catch();

      // return new Promise((resolve, reject) => {
      //   this._http.post(Constants.API_URL + 'findCidadeByEstado/', JSON.stringify(this.estado), this.options)
      //     .map(res=>res.json())
      //     .subscribe(data => {
      //       resolve(data);
      //     }, (err) => {
      //       reject(err.json());
      //     });
      // });

    } catch (e){
      if(e instanceof RangeError){
        console.log('out of range');
      }
    }
  }

  // cadastraUsuario(meusDados: MeusDados) {
  //
  //   let api = `https://aluracar.herokuapp.com/salvarpedido?carro=${agendamento.carro.nome}&preco=${agendamento.valor}&nome=${agendamento.nome}&endereco=${agendamento.endereco}&email=${agendamento.email}&dataAgendamento=${agendamento.data}`;
  //   return this._http
  //     .get(api)
  //     .toPromise()
  // }
}

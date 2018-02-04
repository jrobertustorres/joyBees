import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
// import 'rxjs/add/operator/map';
import { Constants } from '../app/constants';
// import { NavParams } from 'ionic-angular';

//ENTITY
import { CidadeEntity } from './../model/cidade-entity';

//SERVICES
// import { EstadosBrService } from '../providers/estados-service';

@Injectable()
export class CidadesService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, method: "post" });
  private cidadeEntity: CidadeEntity;
  // private idEstado: number;

  constructor(public _http: Http) {}

  public getCidades(idEstado) {
  // public getCidades() {
    // this.estado.idEstado = this.idEstado;
    this.cidadeEntity = new CidadeEntity();
    this.cidadeEntity.idEstado = idEstado;
    console.log(this.cidadeEntity);
    try {

      return this._http.post(Constants.API_URL + 'findCidadeByEstado/', 
        JSON.stringify(this.cidadeEntity), this.options)
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

}

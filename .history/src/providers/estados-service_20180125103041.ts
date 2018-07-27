import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EstadosBrService {
  constructor(private http: Http) {}

  getEstadosBr() {
      return this.http.get('assets/estados/estadosbr.json')
        .map((res: Response) => res.json());
    }
}

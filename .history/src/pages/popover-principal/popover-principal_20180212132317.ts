import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

// SERVICES
import { EstadosService } from '../../providers/estados-service';

@IonicPage()
@Component({
  selector: 'page-popover-principal',
  templateUrl: 'popover-principal.html',
})
export class PopoverPrincipalPage {
  private estados = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private estadosService: EstadosService,
              public viewCtrl: ViewController) {

      this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ionViewDidLoad() {
  }

  // close() {
  //   this.viewCtrl.dismiss();
  // }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalFiltroLancarOrcamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-filtro-lancar-orcamento',
  templateUrl: 'modal-filtro-lancar-orcamento.html',
})
export class ModalFiltroLancarOrcamentoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFiltroLancarOrcamentoPage');
  }

}

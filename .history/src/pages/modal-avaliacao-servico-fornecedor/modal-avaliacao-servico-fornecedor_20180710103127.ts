import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalAvaliacaoServicoFornecedorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-avaliacao-servico-fornecedor',
  templateUrl: 'modal-avaliacao-servico-fornecedor.html',
})
export class ModalAvaliacaoServicoFornecedorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalAvaliacaoServicoFornecedorPage');
  }

}

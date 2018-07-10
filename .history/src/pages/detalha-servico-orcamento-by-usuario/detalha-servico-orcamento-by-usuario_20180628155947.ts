import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalhaServicoOrcamentoByUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalha-servico-orcamento-by-usuario',
  templateUrl: 'detalha-servico-orcamento-by-usuario.html',
})
export class DetalhaServicoOrcamentoByUsuarioPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalhaServicoOrcamentoByUsuarioPage');
  }

}

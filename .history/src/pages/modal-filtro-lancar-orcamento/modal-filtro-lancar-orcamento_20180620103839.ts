import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-filtro-lancar-orcamento',
  templateUrl: 'modal-filtro-lancar-orcamento.html',
})
export class ModalFiltroLancarOrcamentoPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFiltroLancarOrcamentoPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}

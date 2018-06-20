import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-informacoes-por-sevico',
  templateUrl: 'modal-informacoes-por-sevico.html',
})
export class ModalInformacoesPorSevicoPage {
  private idServico: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.idServico = navParams.get('idServico');
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}

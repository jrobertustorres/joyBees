import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PAGES
import { MeusDadosPage } from '../meus-dados/meus-dados';

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  meusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

  minhaSenha() {
    this.navCtrl.push(MinhaSenhaPage);
  }

}

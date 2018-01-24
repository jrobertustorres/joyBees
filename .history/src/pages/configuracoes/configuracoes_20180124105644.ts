import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

//PAGES
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { ModalTermosPage } from '../modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';
import { MinhaSenhaPage } from '../minha-senha/minha-senha';

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }

  meusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

  minhaSenha() {
    this.navCtrl.push(MinhaSenhaPage);
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  openModalPolitica(){
    let modal = this.modalCtrl.create(ModalPoliticaPrivacidadePage);
    modal.present();
  }

}

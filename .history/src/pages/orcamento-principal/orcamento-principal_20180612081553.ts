import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PAGES
import { NovoOrcamentoPage } from './../novo-orcamento/novo-orcamento';

@IonicPage()
@Component({
  selector: 'page-orcamento-principal',
  templateUrl: 'orcamento-principal.html',
})
export class OrcamentoPrincipalPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrcamentoPrincipalPage');
  }

  novoOrcamento() {
    this.navCtrl.push(NovoOrcamentoPage);
  }

}

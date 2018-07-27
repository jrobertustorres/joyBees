import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PAGES
import { NovoOrcamentoPage } from './../novo-orcamento/novo-orcamento';
import { CotacoesListByStatusPage } from '../cotacoes-list-by-status/cotacoes-list-by-status';

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
  }

  openCotacoesList(status) {
    this.navCtrl.push(CotacoesListByStatusPage, {status: status});
  }

  novoOrcamento() {
    this.navCtrl.push(NovoOrcamentoPage);
  }

}

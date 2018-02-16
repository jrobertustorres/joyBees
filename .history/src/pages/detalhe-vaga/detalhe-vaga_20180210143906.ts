import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-detalhe-vaga',
  templateUrl: 'detalhe-vaga.html',
})
export class DetalheVagaPage {
  public idVaga: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {

    this.idVaga = navParams.get('idVaga');
  }

  ngOnInit() {
    this.callDetalheVaga();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalheVagaPage');
  }

  callDetalheVaga() {

  }

}

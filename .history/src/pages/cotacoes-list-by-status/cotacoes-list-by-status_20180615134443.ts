import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cotacoes-list-by-status',
  templateUrl: 'cotacoes-list-by-status.html',
})
export class CotacoesListByStatusPage {
  public status: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.status = navParams.get("status");
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CotacoesListByStatusPage');
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-vagas-em-destaque',
  templateUrl: 'vagas-em-destaque.html',
})
export class VagasEmDestaquePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    // this.getLanguage();
    // this.getVagasDestaque();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VagasEmDestaquePage');
  }

}

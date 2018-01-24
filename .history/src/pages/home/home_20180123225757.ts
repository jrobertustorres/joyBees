import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//PAGES
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  segment: string = "vagasDestaque"; // default button

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

//PAGES
import { LoginPage } from '../login/login';
import { MeusDadosPage } from '../meus-dados/meus-dados';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  segment: string = "vagasDestaque"; // default button

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu : MenuController) {
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on this page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menu.enable(true);
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
  }

  goMeusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

}

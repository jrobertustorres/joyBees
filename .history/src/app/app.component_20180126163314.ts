import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

//PAGES
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { PrincipalPage } from '../pages/principal/principal';
import { MenuPage } from '../pages/menu/menu';

@Component({
  template: '<ion-nav #baseNav></ion-nav>'
})

export class MyApp {
  @ViewChild('baseNav') nav: Nav;
  rootPage:any;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              private network: Network) {
    this.initializeApp();

  }

  ngOnInit() {
    this.nav.push(MenuPage, { animate: false });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // aqui checamos a conexão ao entrar no app
      this.checkNetwork();
      // abaixo verificamos se a intenet cair depois que o cliente já entrou no app
      this.network.onDisconnect().subscribe(() => {
        let alertDisconect = this.alertCtrl.create({
          title: "Internet Connection",
          subTitle:"You are offline. Please Check Your Network connection!",
          buttons: [{
             text: 'Ok',
             handler: () => {
                 this.platform.exitApp();
                }
             }]
           });
           alertDisconect.present();
      });
    });
  }

  checkNetwork() {
    if(this.network.type === 'none') {
      let alert = this.alertCtrl.create({
      title: "Internet Connection",
      subTitle:"You are offline. Please Check Your Network connection!",
      buttons: [{
         text: 'Ok',
         handler: () => {
             this.platform.exitApp();
            }
         }]
       });
     alert.present();
    }
  }

}

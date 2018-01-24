import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
              public menuCtrl: MenuController) {
    this.initializeApp();

  }

  ngOnInit() {
    this.nav.push(MenuPage, { animate: false });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}

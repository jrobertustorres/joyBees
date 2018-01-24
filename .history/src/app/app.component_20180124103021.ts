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
  // templateUrl: 'app.html'
})
export class MyApp {
  // @ViewChild(Nav) nav: Nav;
  @ViewChild('baseNav') nav: Nav;
  rootPage:any;

  // rootPage: any = HomePage;
  // rootPage: any = PrincipalPage;

  // pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public menuCtrl: MenuController) {
    this.initializeApp();

    // this.pages = [
    //   // { title: 'Home', component: HomePage },
    //   { title: 'PrincipalPage', component: PrincipalPage },
    //   { title: 'List', component: ListPage }
    // ];

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

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}

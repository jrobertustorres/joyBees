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

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

@Component({
  template: '<ion-nav #baseNav></ion-nav>'
})

export class MyApp {
  @ViewChild('baseNav') nav: Nav;
  rootPage:any;

  languages = availableLanguages;
  selectedLanguage = sysOptions.systemLanguage;
  private translate: TranslateService;
  private titleConection: string;
  private subTitleConection: string;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              translate: TranslateService,
              private network: Network) {
    this.initializeApp();
    
    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage); 
  }

  ngOnInit() {
    this.getLanguage();
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

  getLanguage(){
    if (this.selectedLanguage == 'pt-br') {
      this.titleConection = 'Obrigado por compartilhar!';
      this.subTitleConection = 'Obrigado por compartilhar!';
    } else {
      this.subTitleConection = 'Thanks for sharing!';
    }
  }

}

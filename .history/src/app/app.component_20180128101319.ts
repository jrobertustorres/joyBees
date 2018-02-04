import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

//PAGES
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
    // let status bar overlay webview
    // this.statusBar.overlaysWebView(true);

    // set status bar to white
    // this.statusBar.backgroundColorByHexString('#CD950C');
    
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
    // if (cordova.platformId == 'android') {
    //   this.statusBar.backgroundColorByHexString('#CD950C');
    // }
      // this.statusBar.styleDefault();
      // this.statusBar.overlaysWebView(true);
      // this.statusBar.backgroundColorByHexString('#CD950C');
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
      title: this.titleConection,
      subTitle: this.subTitleConection,
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
      this.titleConection = 'Conexão de internet!';
      this.subTitleConection = 'Você está offline. Verifique sua conexão de rede!';
    } else {
      this.titleConection = 'Internet Connection!';
      this.subTitleConection = 'You are offline. Please Check Your Network connection!';
    }
  }

}

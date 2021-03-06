import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Push, PushObject, PushOptions} from '@ionic-native/push';
import { Constants } from '../app/constants';
import { AppVersion } from '@ionic-native/app-version';

//PAGES
import { MenuPage } from '../pages/menu/menu';
import { PrincipalPage } from '../pages/principal/principal';

//SERVICES
import { LanguageTranslateService } from '../providers/language-translate-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { defaultLanguage, availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

import { Globalization } from '@ionic-native/globalization';

@Component({
  template: '<ion-nav #baseNav></ion-nav>'
})

export class MyApp {
  @ViewChild('baseNav') nav: Nav;
  rootPage:any;

  languages = availableLanguages;
  selectedLanguage: any;
  private translate: TranslateService;
  private titleConection: string;
  private subTitleConection: string;
  private versao: any;
  public languageDictionary: any;
  private cordova: any;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              translate: TranslateService,
              private globalization: Globalization,
              private network: Network, 
              private languageTranslateService: LanguageTranslateService,
              private appVersion: AppVersion,
              public push: Push) {
    this.initializeApp();

    this.translate = translate;
  }

  ngOnInit() {
    // this.nav.push(MenuPage, { animate: false });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(()=>this.myHandlerFunction());
      this.getLanguegeDefault();

      if (this.platform.is('cordova')) {
        this.appVersion.getVersionNumber().then((version) => {
          localStorage.setItem(Constants.VERSION_NUMBER, version);
        })
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      // this.getTraducao();
      this.pushSetup();
      // aqui checamos a conex??o ao entrar no app
      // this.checkNetwork();

      // abaixo verificamos se a intenet cair depois que o cliente j?? entrou no app
      this.network.onDisconnect().subscribe(() => {
        let alertDisconect = this.alertCtrl.create({
          title: this.languageDictionary.TITLE_CONECTION,
          subTitle: this.languageDictionary.SUBTITLE_CONECTION,
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

  myHandlerFunction(){
    //desabilitando o bot??o de voltar do android
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        // aqui checamos a conex??o ao entrar no app
        this.checkNetwork();
        this.nav.push(MenuPage, { animate: false });
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  pushSetup() {
    const options: PushOptions = {
     android: {
         senderID: '687343514761'
     },
     ios: {
         alert: 'true',
         badge: true,
         sound: 'true'
     },
     windows: {}
  };

  const pushObject: PushObject = this.push.init(options);

  pushObject.on('registration').subscribe((registration: any) => {
    localStorage.setItem(Constants.TOKEN_PUSH,registration.registrationId);
  });

  pushObject.on('notification').subscribe((data: any) => {
    if (data.additionalData.foreground) {
      let confirmAlert = this.alertCtrl.create({
        title: this.languageDictionary.LABEL_NOVA_NOTIFICACAO,
        message: data.message,
        buttons: [{
          text: this.languageDictionary.BTN_PUSH_IGNORAR,
          role: 'cancel'
        }, {
          text: this.languageDictionary.BTN_PUSH_VER,
          handler: () => {
            this.nav.push(PrincipalPage);
            // this.nav.push(DetailsPage, { message: data.message });
          }
        }]
      });
      confirmAlert.present();
    } else {
      // this.nav.push(OrcamentosListPage);
      console.log('Push notification clicked');
    }
  });

  pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }

  checkNetwork() {
    if(this.network.type === 'none') {
      let alert = this.alertCtrl.create({
      title: this.languageDictionary.TITLE_CONECTION,
      subTitle: this.languageDictionary.SUBTITLE_CONECTION,
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

  //OBTENDO O IDIOMA CONFIGURADO NO APARELHO
  getLanguegeDefault() {
    if ((<any>window).cordova) {
      this.globalization.getPreferredLanguage().then(result => {
        let idioma = result.value == 'pt-BR' ? 'pt-br' : 'en';
        localStorage.setItem(Constants.IDIOMA_USUARIO, idioma);
        this.getTraducao();
      });
    }
    else {
      let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
      browserLanguage = browserLanguage == 'pt' ? 'pt-br' : 'en';
      localStorage.setItem(Constants.IDIOMA_USUARIO, browserLanguage);
      this.getTraducao();
    }

  }

}

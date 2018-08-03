import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Push, PushObject, PushOptions} from '@ionic-native/push';
import { Constants } from '../app/constants';
import { AppVersion } from '@ionic-native/app-version';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

//PAGES
import { MenuPage } from '../pages/menu/menu';

//ENTITYS
// import { VersaoAppEntity } from '../model/versao-app-entity';

//SERVICES
// import { VersaoAppService } from '../providers/versao-app-service';
import { LanguageTranslateService } from '../providers/language-translate-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
// import { defaultLanguage, availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';
import { availableLanguages, sysOptions } from '../pages/i18n/i18n-constants';

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
  private _idioma: string;
  private versao: any;
  public languageDictionary: any;
  // private versaoAppEntity: VersaoAppEntity;
  private cordova: any;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              translate: TranslateService,
              private globalization: Globalization,
              private network: Network, 
              // private versaoAppService: VersaoAppService,
              private languageTranslateService: LanguageTranslateService,
              private appVersion: AppVersion,
              // private inAppBrowser: InAppBrowser,
              public push: Push) {
    this.initializeApp();
    // this.versaoAppEntity = new VersaoAppEntity();

    this.translate = translate;
  }

  ngOnInit() {
    // this.getLanguage();
    this.getTraducao();
    this.nav.push(MenuPage, { animate: false });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // window.open = cordova.InAppBrowser.open;
      console.log('inicialization');

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
      // aqui checamos a conexão ao entrar no app
      // this.checkNetwork();

      // abaixo verificamos se a intenet cair depois que o cliente já entrou no app
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

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        // aqui checamos a conexão ao entrar no app
        this.checkNetwork();
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
         senderID: '1143021206'
     },
     ios: {
         alert: 'true',
         badge: true,
         sound: 'false'
     },
     windows: {}
  };

  const pushObject: PushObject = this.push.init(options);

  pushObject.on('notification').subscribe((notification: any) => {
    if (notification.additionalData.foreground) {
      let youralert = this.alertCtrl.create({
        title: 'New Push notification',
        message: notification.message
      });
      youralert.present();
    }
  });

  pushObject.on('registration').subscribe((registration: any) => {
    console.log(registration);
    localStorage.setItem(Constants.TOKEN_PUSH,registration.registrationId);
    // localStorage.setItem('tokenPush',registration.registrationId);
     //do whatever you want with the registration ID
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
    // else {
    //   this.getAtualizacaoStatus();
    // }
  }

  //OBTENDO O IDIOMA CONFIGURADO NO APARELHO
  getLanguegeDefault() {
    // this.translate.setDefaultLang(defaultLanguage);
    // console.log(defaultLanguage);

    // if (this.platform.is('cordova')) {
      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage().then(result => {
          var language = this.getSuitableLanguage(result.value);
          this.translate.use(language);
          console.log(language);
          console.log('getLanguegeDefault====>');
          sysOptions.systemLanguage = language;
          console.log(sysOptions.systemLanguage);
        });
      }
      else {
        // let browserLanguage = this.translate.getBrowserLang() || defaultLanguage;
        let browserLanguage = this.translate.getBrowserLang();
        var language = this.getSuitableLanguage(browserLanguage);
        this.translate.use(language);
        sysOptions.systemLanguage = language;
        console.log(sysOptions.systemLanguage);
      }
      console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
      localStorage.setItem(Constants.IDIOMA_USUARIO, sysOptions.systemLanguage);

  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }

  // getAtualizacaoStatus() {
  //   try {
  //     // this.loading = this.loadingCtrl.create({
  //     //   content: this.languageDictionary.LOADING_TEXT
  //     // });
  //     // this.loading.present();

  //     this.versaoAppEntity.versao = localStorage.getItem(Constants.VERSION_NUMBER);

  //     this.versaoAppService.versaoApp(this.versaoAppEntity)
  //     .then((versaoResult: VersaoAppEntity) => {
  //       this.versao = versaoResult;

  //       console.log(this.versao);

  //       if(this.versao.descontinuado == true) { //voltar para true
  //         this.showAlertVersao(this.versao);
  //       } else {
  //         this.nav.push(MenuPage, { animate: false });
  //       }

  //       // this.loading.dismiss();
  //     }, (err) => {
  //       // this.loading.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });

  //   }catch (err){
  //     if(err instanceof RangeError){
  //     }
  //     console.log(err);
  //   }
  // }

  // showAlertVersao(versao) {
  //   const alert = this.alertCtrl.create({
  //     title: this.languageDictionary.TITLE_ATUALIZACAO_APP,
  //     subTitle: this.languageDictionary.SUBTITLE_ATUALIZACAO_APP,
  //     buttons: [
  //       {
  //       text: 'OK',
  //         handler: () => {
  //           this.getPlatform(versao);
  //         }
  //     }]
  //   });
  //   alert.present();
  // }

  // getPlatform(versao) {
  //   if (this.platform.is('ios')) {
  //     // This will only print when on iOS
  //     console.log('I am an iOS device!');
  //     this.inAppBrowser.create(versao.linkIos, '_system', 'location=yes');
  //     // const browser = this.inAppBrowser.create(url, '_self', options);
  //     this.platform.exitApp();
  //   }

  //   if (this.platform.is('android')) {
  //     // This will only print when on iOS
  //     console.log('I am an android device!');
  //     this.inAppBrowser.create(versao.linkAndroid, '_system', 'location=yes');
  //     // const browser = this.inAppBrowser.create(url, '_self', options);
  //     // window.open(href, '_system', 'location=yes');
  //     this.platform.exitApp();
  //   }
    
  // }




  // openURLIos = (link) => {
  //   window.open('https://www.instagram.com/pagetopen/', '_system');
  // }
  // openURLGoogle = (lindAndroid) => {
  //   window.open('https://www.instagram.com/pagetopen/', '_system');
  // }

  // loginFacebook() {
  //   let env = this;
  //   this._storage.get('user')
  //   .then( function (data) {
  //     // user is previously logged and we have his data
  //     // we will let him access the app
  //     // env.nav.push(UserPage);
  //     env.splashScreen.hide();
  //   }, function (error) {
  //     //we don't have the user data so we will ask him to log in
  //     // env.nav.push(LoginPage);
  //     env.splashScreen.hide();
  //   });
  // }

  // getLanguage(){
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   // this._storage.get('selectedLanguage').then((selectedLanguage) => {
  //       if(!localStorage.getItem('selectedLanguage')){
  //         this.selectedLanguage = this._idioma;
  //       }
  //       // else if(selectedLanguage) {
  //       else if(localStorage.getItem('selectedLanguage')) {
  //         this.selectedLanguage = localStorage.getItem('selectedLanguage');
  //         if (this.selectedLanguage == 'pt-br') {
  //           this.titleConection = 'Conexão de internet!';
  //           this.subTitleConection = 'Você está offline. Verifique sua conexão de rede!';
  //         } else {
  //           this.titleConection = 'Internet Connection!';
  //           this.subTitleConection = 'You are offline. Please Check Your Network connection!';
  //         }
  //       }
  //       this.translate.use(this.selectedLanguage);

      // });


    // if (this.selectedLanguage == 'pt-br') {
    //   this.titleConection = 'Conexão de internet!';
    //   this.subTitleConection = 'Você está offline. Verifique sua conexão de rede!';
    // } else {
    //   this.titleConection = 'Internet Connection!';
    //   this.subTitleConection = 'You are offline. Please Check Your Network connection!';
    // }
  // }

}

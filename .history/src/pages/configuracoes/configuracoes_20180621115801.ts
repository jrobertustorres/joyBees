import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
// import { Storage } from '@ionic/storage';
import { Constants } from '../../app/constants';

// PAGES
import { ModalTermosPage } from '../modal-termos/modal-termos';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { MinhaSenhaPage } from './../minha-senha/minha-senha';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';

// @IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage implements OnInit {
  public languageChangeEvent = new EventEmitter();
  public languageDictionary: any;

  languages = availableLanguages;
  // selectedLanguage = sysOptions.systemLanguage;
  selectedLanguage: any;
  private translate: TranslateService;
  private messagePresentToast: string;
  // private titleAlert: string;
  // private subTitleAlert: string;
  private socialSharingTitle: string;
  private erroAppSubject: string;
  private erroAppBody: string;
  private infoSuporte: string;
  private _idioma: any;
  private loading = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private socialSharing: SocialSharing,
              private toastCtrl: ToastController,
              private emailComposer: EmailComposer,
              private appVersion: AppVersion,
              private device: Device,
              private languageProvider: LanguageProvider,
              private languageTranslateService: LanguageTranslateService,
              translate: TranslateService) {

    this.translate = translate;
    // TIVE QUE FAZER ISSO PARA QUANDO ENTRAR NO APP NÃO PEGAR O IDIOMA PADRÃO E SIM O QUE O USUÁRIO SELECIONOU(depois de ter setado o idioma preferencial)
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO) == null ? this._idioma : localStorage.getItem(Constants.IDIOMA_USUARIO);

    // this._storage.get('selectedLanguage').then((selectedLanguage) => {
    //   console.log('Is selectedLanguage : ', selectedLanguage);
    //   if(!selectedLanguage){
    //     this.selectedLanguage = this._idioma;
    //   }
    //   else if(selectedLanguage) {
    //     this.selectedLanguage = selectedLanguage;
    //   }

      console.log(this.selectedLanguage);

    //   this.translate.use(this.selectedLanguage);
    //   this.languageProvider.getLanguageProvider(this.selectedLanguage);
    // });

    // this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO) == null ? sysOptions.systemLanguage : localStorage.getItem(Constants.IDIOMA_USUARIO);
  }

  ngOnInit() {
    // this.getLanguage();
    // this.getTraducao();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;

      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  applyLanguage() {
    // if (this.selectedLanguage != sysOptions.systemLanguage) {
    // if (this.selectedLanguage != this._idioma) {
    //   localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);
    //   console.log('11111111111111111111');
    // } else {
    //   localStorage.setItem(Constants.IDIOMA_USUARIO, this._idioma);
    //   console.log('22222222222222222222');
    // }

    // if (this.selectedLanguage == 'pt-br') {
    //   this.loading = 'Aguarde...';
    // } else {
    //   this.loading = 'Wait...';
    // }
    // this.loading = this.loadingCtrl.create({
    //   content: this.loading
    // });
    // this.loading.present();

    // this._storage.get('selectedLanguage').then((selectedLanguage) => {
    //   console.log('Is selectedLanguage : ', selectedLanguage);
    //   if(selectedLanguage) {
    //     this._idioma = selectedLanguage;
    //     console.log(this._idioma);
    //     this.translate.use(this._idioma);
    //     this.languageProvider.getLanguageProvider(selectedLanguage);
    //     // this.loading.dismiss();
    //   }
    // });

    // localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);

    console.log(this.selectedLanguage);
    
    this.setTraducao(this.selectedLanguage);
    // this.translate.use(this.selectedLanguage);
    // this.languageProvider.getLanguageProvider(this.selectedLanguage);
    
  }

  setTraducao(selectedLanguage) {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();
      console.log('sssssssssssssssssss');
      
      this.languageProvider.setLanguageService(selectedLanguage)
        .then(() => {

          console.log('dddddddddddddddddddddddddddddddd');
          this.loading.dismiss();
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
    }
    catch (err){
      this.loading.dismiss();
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.messagePresentToast,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  openModalPolitica(){
    let modal = this.modalCtrl.create(ModalPoliticaPrivacidadePage);
    modal.present();
  }

  shareAnyWhere() {
    // this.socialSharing.share("Indicação para experimentar o Pet Prático. Tenha todos os Pet Shops em um mesmo lugar. Na palma de sua mão!","",
    this.socialSharing.share(this.socialSharingTitle,"",
         "http://www.petpratico.com.br/logo_shared.jpg", "https://play.google.com/store/apps/details?id=br.com.logiictecnologia.festaideal")
    .then(() => {
      this.presentToast();
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  sendEmailBug() {
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
      }
     });
     
     let email = {
       to: 'diretoria@logiic.com.br',
       cc: ['jose@logiic.com.br', 'bruno@logiic.com.br'],
       subject: this.erroAppSubject,
       body: '<p><h1>'+ this.erroAppBody +'</h1></p>' +
       '<h1>'+ this.infoSuporte +'</h1>'+
       '<h1>JoyBees v'+ this.appVersion.getVersionCode() +'</h1>' +
       '<h1>'+ this.device.model +'</h1>' +
       '<h1>'+ this.device.platform +' '+ this.device.version +'</h1>' +
       '<h1>----------------------</h1>',
       isHtml: true
     };

     this.emailComposer.open(email);
  }

  meusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

  minhaSenha() {
    this.navCtrl.push(MinhaSenhaPage);
  }

  // showAlertModoCliente() {
  //   let alert = this.alertCtrl.create({
  //     title: this.titleAlert,
  //     subTitle: this.subTitleAlert,
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

  // getLanguage(){
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
  //   if(!this.selectedLanguage){
  //     this.selectedLanguage = this._idioma;
  //   }
  //   else if(this.selectedLanguage) {
  //     if (this.selectedLanguage == 'pt-br') {
  //       this.messagePresentToast = 'Obrigado por compartilhar!';
  //       this.socialSharingTitle = 'Indicação para experimentar o JoyBees. Encontre as melhores vagas e os melhores fornecedores de produtos/serviços.';
  //       this.erroAppSubject = 'Problema encontrado no app';
  //       this.erroAppBody = 'Olá! Descreva abaixo o problema encontrado e logo analizaremos.';
  //       this.infoSuporte = 'Informações para suporte';
  //     } else {
  //       this.messagePresentToast = 'Thanks for sharing!';
  //       this.socialSharingTitle = 'Indication to try the Practical Pet. Have all Pet Shops in one place. In the palm of your hand!';
  //       this.erroAppSubject = 'Issue found in app';
  //       this.erroAppBody = 'Hello! Please describe the problem below and we will discuss it shortly.';
  //       this.infoSuporte = 'Support Information';
  //     }
  //   }
  //   this.translate.use(this.selectedLanguage);

  // }

}

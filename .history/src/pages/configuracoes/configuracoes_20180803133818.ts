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
import { MeuEnderecoPage } from '../meu-endereco/meu-endereco';

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
  // private loading = null;

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
    // this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    // this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO) == null ? this._idioma : localStorage.getItem(Constants.IDIOMA_USUARIO);

  }

  ngOnInit() {
    this.getTraducao();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
        this.selectedLanguage = this.selectedLanguage == 'pt' ? 'pt-br' : 'en';
        
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
    console.log(this.selectedLanguage);
    this.selectedLanguage = this.selectedLanguage == 'pt-br' ? 'pt' : 'en';
    // localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);
    console.log(this.selectedLanguage);
    console.log(localStorage.getItem(Constants.IDIOMA_USUARIO));
    this.translate.use(this.selectedLanguage);
    this.languageProvider.getLanguageProvider(this.selectedLanguage);
    
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

  meuEndereco() {
    this.navCtrl.push(MeuEnderecoPage);
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

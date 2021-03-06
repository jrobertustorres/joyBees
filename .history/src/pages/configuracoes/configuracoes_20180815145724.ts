import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { Constants } from '../../app/constants';

//ENTITY
import { UsuarioRamoEmpresaEntity } from '../../model/usuario-ramo-empresa-entity';

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
import { RamoEmpresaService } from '../../providers/ramo-empresa-service';

// @IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage implements OnInit {
  public languageChangeEvent = new EventEmitter();
  public languageDictionary: any;
  private loading = null;
  private ramoEmpresa: any = [];

  languages = availableLanguages;
  selectedLanguage: any;
  private translate: TranslateService;
  private messagePresentToast: string;
  private socialSharingTitle: string;
  private erroAppSubject: string;
  private erroAppBody: string;
  private infoSuporte: string;
  private _idioma: any;
  private usuarioRamoEmpresaEntity: UsuarioRamoEmpresaEntity;

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
              private ramoEmpresaService: RamoEmpresaService,
              private languageTranslateService: LanguageTranslateService,
              translate: TranslateService) {

    this.translate = translate;
    this.usuarioRamoEmpresaEntity = new UsuarioRamoEmpresaEntity();
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
        this.getRamoEmpresaPush();
        
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
    localStorage.setItem(Constants.IDIOMA_USUARIO, this.selectedLanguage);
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

  getRamoEmpresaPush() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.ramoEmpresaService.findUsuarioRamoSelecionado()
        .then((ramoEntityResult) => {
          this.ramoEmpresa = ramoEntityResult;

          console.log(this.ramoEmpresa);

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
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  // ramosInteressePush(selectedValue: any) {
  //   console.log('Selected', selectedValue);
  // }

  ramosInteressePush(selectedValue: any) {
    console.log('Selected', selectedValue);
    if (selectedValue) {
      
      try {
        
        // this.loading = this.loadingCtrl.create({
        //   content: this.languageDictionary.LOADING_TEXT
        // });
        // this.loading.present();

        let objetoRamo: any = [];
        for(let i=0; i < selectedValue.length; i++) {
          console.log(selectedValue[i]);
          objetoRamo.push(selectedValue[i]);
        }

        console.log(objetoRamo);
        this.usuarioRamoEmpresaEntity = objetoRamo;
        console.log(this.usuarioRamoEmpresaEntity);
        // this.ramoEmpresaService
        // .saveUsuarioRamoSelecionado(this.usuarioRamoEmpresaEntity)
        // .then((usuarioRamoEmpresaEntityResult: UsuarioRamoEmpresaEntity) => {

        //   this.loading.dismiss();
        //   this.presentToast();
        //   setTimeout(() => {
        //   }, 3000);
    
        // }, (err) => {
        //   this.loading.dismiss();
        //   this.alertCtrl.create({
        //     subTitle: err.message,
        //     buttons: ['OK']
        //   }).present();
        // });
      }
      catch (err){
        if(err instanceof RangeError){
          console.log('out of range');
        }
        console.log(err);
      }
    }
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
    // this.socialSharing.share("Indica????o para experimentar o Pet Pr??tico. Tenha todos os Pet Shops em um mesmo lugar. Na palma de sua m??o!","",
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

}

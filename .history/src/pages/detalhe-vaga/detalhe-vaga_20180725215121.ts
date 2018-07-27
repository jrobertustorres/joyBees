import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
// import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from './../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITY
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//PAGES
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

@IonicPage()
@Component({
  selector: 'page-detalhe-vaga',
  templateUrl: 'detalhe-vaga.html',
})
export class DetalheVagaPage {
  // languages = availableLanguages;
  // selectedLanguage: any;
  // private translate: TranslateService;
  public idVaga: number;
  public candidatado: string;
  private loading: any;
  private vagaDetalheEntity: VagaDetalheEntity;
  private messagePresentToast: string;
  // private _idioma: string;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              // translate: TranslateService,
              private languageTranslateService: LanguageTranslateService,
              private vagaService: VagaService) {

    // this.translate = translate;

    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.idVaga = navParams.get('idVaga');
    // this.candidatado = navParams.get('candidatado');

  }

  ngOnInit() {
    // this.getLanguage();
    this.getTraducao();
    // this.callDetalheVaga();
    // this.previewPage = this.navCtrl.getPrevious().name;
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.callDetalheVaga();
      });
    }
    catch (err){
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


  callDetalheVaga() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity.idVaga = this.idVaga;
   
      this.vagaService.findVagaDetalhe(this.vagaDetalheEntity)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.vagaDetalheEntity = vagaDetalheEntityResult;
          console.log(this.vagaDetalheEntity);
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

  verificaCandidatoVaga(idVagaUsuario) {
    console.log(idVagaUsuario);
    if(!localStorage.getItem(Constants.IS_CADASTRO_COMPLETO_VAGA)){
      this.showAlertCadastroCompleto();
    } else {
      if (this.vagaDetalheEntity.isCandidatado) {
        let alert = this.alertCtrl.create({
          title: this.languageDictionary.MESSAGE_TITLE_DESCARTAR_VAGA,
          subTitle: this.languageDictionary.MESSAGE_DESCARTAR_VAGA,
          buttons: [
            {
              text: this.languageDictionary.BTN_MANTER_VAGA,
              cssClass: 'btnCancelCss',
              role: 'cancel',
            },
            {
              text: this.languageDictionary.BTN_DESCARTAR_VAGA,
              cssClass: 'btnDescartCss',
              handler: () => {
                this.descartarVaga(idVagaUsuario);
              }
            }
          ]
        });
        alert.present();
        
      } else {
        let alert = this.alertCtrl.create({
          title: this.languageDictionary.MESSAGE_TITLE_CANDIDATAR,
          subTitle: this.languageDictionary.MESSAGE_SUBTITLE_VAGA,
          buttons: [
            {
              text: this.languageDictionary.CANCELAR_UPPER,
              cssClass: 'btnCancelCss',
              role: 'cancel',
            },
            {
              text: this.languageDictionary.BTN_CANDIDATAR_VAGA,
              cssClass: 'btnCandidatCss',
              handler: () => {
                this.candidatarVaga(idVaga);
              }
            }
          ]
        });
        alert.present();
        
      }
    }
  }

  candidatarVaga(idVaga) {
    try {

      // if(!localStorage.getItem(Constants.IS_CADASTRO_COMPLETO_VAGA)){
      //   this.showAlertCadastroCompleto();
      // }
      // else if(localStorage.getItem(Constants.IS_CADASTRO_COMPLETO_VAGA)) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT
        });
        this.loading.present();
  
        this.vagaService.callCandidatarVaga(idVaga)
          .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
            this.loading.dismiss();
  
            this.messagePresentToast = this.languageDictionary.MESSAGE_PARABENS_CANDIDATADO;
  
            this.presentToast();
            setTimeout(() => {
              this.navCtrl.setRoot(PrincipalPage);
            }, 3000);
          }, (err) => {
            this.loading.dismiss();
            this.alertCtrl.create({
              subTitle: err.message,
              buttons: ['OK']
            }).present();
          });
      // }
      
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  showAlertCadastroCompleto() {
    let alert = this.alertCtrl.create({
      title: this.languageDictionary.CADASTRO_IMCOPLETO_TEXT,
      subTitle: this.languageDictionary.MESSAGE_SUBTIBLE_CADASTRO_INCOMPLETO_VAGA,
      buttons: [
        {
          text: this.languageDictionary.CANCELAR,
        },
        {
          text: this.languageDictionary.BTN_CONFIG,
          handler: () => {
            this.navCtrl.setRoot(ConfiguracoesPage,{}, { animate: true, direction: 'back' });
          }
        }
      ]
    });
    alert.present();
  }

  descartarVaga(idVagaUsuario) {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.vagaService.callCandidatarVaga(idVagaUsuario)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.loading.dismiss();
          this.messagePresentToast = this.languageDictionary.MESSAGE_PARABENS_CANDIDATADO; 
          this.presentToast();
          setTimeout(() => {
            this.navCtrl.setRoot(PrincipalPage);
          }, 3000);
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

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
  //   if(!this.selectedLanguage){
  //     this.selectedLanguage = this._idioma;
  //   } else if(this.selectedLanguage) {
  //     if (this.selectedLanguage == 'pt-br') {
  //       this.messagePresentToast = 'Parabéns! Você está candidatado à esta vaga!';
  //       this.messageDescartarToast = 'Você não está mais candidatado à esta vaga!';
  //       this.loadingText = 'Aguarde...';
  //       this.subTitleVaga = 'Deseja se candidatar à esta vaga?';
  //       this.subTitleDescartarVaga = 'Deseja descartar esta vaga?';
  //       this.candidatarText = 'CANDIDATAR-ME';
  //       this.descartarText = 'DESCARTAR';
  //       this.cancelar = 'CANCELAR';
  //       this.manter = 'MANTER';
  //       this.titleCadastro = 'Cadastro incompleto!';
  //       this.subTitleCadastro = 'Para se candidatar, você precisa completar seu cadastro.';
  //     } else {
  //       this.messagePresentToast = 'Congratulations! You are applying for this vacancy!';
  //       this.messageDescartarToast = 'You are no longer a candidate for this job!';
  //       this.loadingText = 'Wait...';
  //       this.subTitleVaga = 'Do you want to apply for this vacancy?';
  //       this.subTitleDescartarVaga = 'Do you want to discard this vacancy?';
  //       this.candidatarText = 'APPLY FOR';
  //       this.descartarText = 'DISCARD';
  //       this.cancelar = 'CANCEL';
  //       this.manter = 'KEEP';
  //       this.titleCadastro = 'Incomplete registration!';
  //       this.subTitleCadastro = 'To apply, you need to complete your registration.';
  //     }
  //   }
  //   this.callDetalheVaga();
  //   // this.translate.use(this.selectedLanguage);
  // }

}

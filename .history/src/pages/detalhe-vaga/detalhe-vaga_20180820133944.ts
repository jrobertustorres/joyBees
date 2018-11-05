import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Constants } from '../../app/constants';

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
  public idVagaUsuario: number;
  public idVaga: number;
  public candidatado: string;
  private loading: any;
  private vagaDetalheEntity: VagaDetalheEntity;
  private messagePresentToast: string;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private languageTranslateService: LanguageTranslateService,
              private vagaService: VagaService) {

    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.idVagaUsuario = navParams.get('idVagaUsuario');
    this.idVaga = navParams.get('idVaga');

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
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.vagaDetalheEntity.idVagaUsuario = this.idVagaUsuario;
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

  verificaCandidatoVaga(idVaga, idVagaUsuario) {
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
          content: this.languageDictionary.LOADING_TEXT,
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
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.vagaService.callDescartarVaga(idVagaUsuario)
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

}

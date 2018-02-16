import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
// import { DetalhesVagaService } from '../../providers/detalhe-vaga-service';
import { VagaService } from './../../providers/vaga-service';

//ENTITY
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//PAGES
import { PrincipalPage } from '../principal/principal';


@IonicPage()
@Component({
  selector: 'page-detalhe-vaga',
  templateUrl: 'detalhe-vaga.html',
})
export class DetalheVagaPage {
  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  public idVaga: number;
  public candidatado: string;
  private loading: any;
  private loadingText: string;
  private vagaDetalheEntity: VagaDetalheEntity;
  private messagePresentToast: string;
  private messageDescartarToast: string;
  private subTitleVaga: string;
  private candidatarText: string;
  private cancelar: string;
  private manter: string;
  private subTitleDescartarVaga: string;
  private descartarText: string;
  // private previewPage: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              translate: TranslateService,
              private vagaService: VagaService) {

    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage);

    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.idVaga = navParams.get('idVaga');
    // this.candidatado = navParams.get('candidatado');

  }

  ngOnInit() {
    this.getLanguage();
    this.callDetalheVaga();
    // console.log(this.candidatado);
    // this.previewPage = this.navCtrl.getPrevious().name;
  }

  ionViewDidLoad() {
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
        content: this.loadingText
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

  verificaCandidatoVaga(idVaga) {
    // console.log(idVaga);
    console.log(this.vagaDetalheEntity.isCandidatado);
    // if (this.candidatado) {
    //   let alert = this.alertCtrl.create({
    //     subTitle: this.subTitleDescartarVaga,
    //     buttons: [
    //       {
    //         text: this.manter,
    //         role: 'cancel',
    //       },
    //       {
    //         text: this.descartarText,
    //         cssClass: 'btnDescartCss',
    //         handler: () => {
    //           this.descartarVaga(idVaga);
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();
      
    // } else {
    //   let alert = this.alertCtrl.create({
    //     subTitle: this.subTitleVaga,
    //     buttons: [
    //       {
    //         text: this.cancelar,
    //         role: 'cancel'
    //       },
    //       {
    //         text: this.candidatarText,
    //         cssClass: 'btnCandidatCss',
    //         handler: () => {
    //           this.candidatarVaga(idVaga);
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();
      
    // }
  }

  candidatarVaga(idVaga) {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.callCandidatarVaga(idVaga)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.loading.dismiss();

          this.messagePresentToast = this.messageDescartarToast;

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

  descartarVaga(idVaga) {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.callCandidatarVaga(idVaga)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.loading.dismiss();
          this.messagePresentToast = this.messagePresentToast;
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

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.messagePresentToast = 'Parabéns! Você está candidatado à esta vaga!';
      this.messageDescartarToast = 'Você não está mais candidatado à esta vaga!';
      this.loadingText = 'Aguarde...';
      this.subTitleVaga = 'Deseja se candidatar à esta vaga?';
      this.subTitleDescartarVaga = 'Deseja descartar esta vaga?';
      this.candidatarText = 'CANDIDATAR-ME';
      this.descartarText = 'DESCARTAR';
      this.cancelar = 'CANCELAR';
      this.manter = 'MANTER';
    } else {
      this.messagePresentToast = 'Congratulations! You are applying for this vacancy!';
      this.messageDescartarToast = 'You are no longer a candidate for this job!';
      this.loadingText = 'Wait...';
      this.subTitleVaga = 'Do you want to apply for this vacancy?';
      this.subTitleDescartarVaga = 'Do you want to discard this vacancy?';
      this.candidatarText = 'APPLY FOR';
      this.descartarText = 'DISCARD';
      this.cancelar = 'CANCEL';
      this.manter = 'KEEP';
    }
  }

}

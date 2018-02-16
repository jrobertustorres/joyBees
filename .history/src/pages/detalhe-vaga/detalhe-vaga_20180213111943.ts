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
    this.candidatado = navParams.get('candidatado');

  }

  ngOnInit() {
    this.getLanguage();
    this.callDetalheVaga();
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

  candidatarVaga(idVaga) {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.callCandidatarVaga(idVaga)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.loading.dismiss();
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

  verificaCandidatoVaga() {
    console.log(this.candidatado);
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
      this.loadingText = 'Aguarde...';
    } else {
      this.messagePresentToast = 'Congratulations! You are applying for this vacancy!';
      this.loadingText = 'Wait...';
    }
  }

}

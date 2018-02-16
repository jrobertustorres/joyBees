import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from './../../providers/vaga-service';

//ENTITY
import { VagaListaEntity } from '../../model/vaga-lista-entity';


@IonicPage()
@Component({
  selector: 'page-vagas-candidatadas',
  templateUrl: 'vagas-candidatadas.html',
})
export class VagasCandidatadasPage {
  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;

  private loading: any;
  private loadingText: string;
  private vagaListaEntity: VagaListaEntity;
  private messagePresentToast: string;
  private vagas;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              translate: TranslateService,
              private vagaService: VagaService,
              public loadingCtrl: LoadingController) {

    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage);

    this.vagaListaEntity = new VagaListaEntity();
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    // this.getLanguage();
    this.getVagasCandidatadas();
  }

  getVagasCandidatadas() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.getVagasPrincipal()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          console.log(this.vagas);
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

  // callVagasCandidatadas() {
  //   try {
      
  //     this.loading = this.loadingCtrl.create({
  //       content: this.loadingText
  //     });
  //     this.loading.present();

  //     this.vagaListaEntity = new VagaListaEntity();
  //     // this.vagaDetalheEntity.idVaga = this.idVaga;
   
  //     this.vagaService.findVagaDetalhe(this.vagaListaEntity)
  //       .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
  //         this.vagaDetalheEntity = vagaDetalheEntityResult;
  //         console.log(this.vagaDetalheEntity);
  //         this.loading.dismiss();
  //       }, (err) => {
  //         this.loading.dismiss();
  //         this.alertCtrl.create({
  //           subTitle: err.message,
  //           buttons: ['OK']
  //         }).present();
  //       });

  //   }
  //   catch (err){
  //     if(err instanceof RangeError){
  //       console.log('out of range');
  //     }
  //     console.log(err);
  //   }
  // }

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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from './../../providers/vaga-service';

//ENTITY
import { VagaListaEntity } from '../../model/vaga-lista-entity';

//PAGES
import { DetalheVagaPage } from '../detalhe-vaga/detalhe-vaga';


@IonicPage()
@Component({
  selector: 'page-vagas-candidatadas',
  templateUrl: 'vagas-candidatadas.html',
})
export class VagasCandidatadasPage {
  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private _idioma: string;

  private loading: any;
  private loadingText: string;
  private vagaListaEntity: VagaListaEntity;
  private vagas;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              translate: TranslateService,
              private vagaService: VagaService,
              private nativeStorage: NativeStorage,
              public loadingCtrl: LoadingController) {

    this.translate = translate;
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = this.nativeStorage.getItem("selectedLanguage") == null ? this._idioma : this.nativeStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage);

    this.vagaListaEntity = new VagaListaEntity();
  }
  
  ngOnInit() {
    this.getLanguage();
    this.getVagasCandidatadas();
  }

  ionViewDidLoad() {
  }

  getVagasCandidatadas() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.findVagasCandidatadas()
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

  detalheVagaCandidatada(idVaga) {
    this.navCtrl.push(DetalheVagaPage, {
      idVaga: idVaga,
      candidatado: true
    })
  }

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.loadingText = 'Aguarde...';
    } else {
      this.loadingText = 'Wait...';
    }
  }

}
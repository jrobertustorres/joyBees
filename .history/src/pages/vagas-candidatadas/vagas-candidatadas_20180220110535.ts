import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
// import { LanguageTranslateService } from '../../providers/language-translate-service';

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
              public loadingCtrl: LoadingController) {

    this.translate = translate;
    // this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    // this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? this._idioma : localStorage.getItem("selectedLanguage");
    // this.translate.use(this.selectedLanguage);

    this.vagaListaEntity = new VagaListaEntity();
  }
  
  ngOnInit() {
    this.getLanguage();
    // this.getVagasCandidatadas();
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

  //   this.languageTranslateService
  //   .getTranslate().then(dados => {
  //     this.translate.use(dados);
  // });

    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    // this._storage.get('selectedLanguage').then((selectedLanguage) => {
        if(!this.selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(this.selectedLanguage) {
          this.selectedLanguage = this.selectedLanguage;
          console.log(this.selectedLanguage);
          if (this.selectedLanguage == 'pt-br') {
            this.loadingText = 'Aguarde...';
          } else {
            this.loadingText = 'Wait...';
          }
        }
        this.getVagasCandidatadas();
        this.translate.use(this.selectedLanguage);

      // });


    // if (this.selectedLanguage == 'pt-br') {
    //   this.loadingText = 'Aguarde...';
    // } else {
    //   this.loadingText = 'Wait...';
    // }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
// import { Constants } from '../../app/constants';

//I18N
// import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

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
  // languages = availableLanguages;
  // selectedLanguage = null;
  // private translate: TranslateService;
  // private _idioma: string;

  public languageDictionary: any;

  private loading: any;
  // private loadingText: string;
  private vagaListaEntity: VagaListaEntity;
  private vagas;
  private refresh: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              // translate: TranslateService,
              private vagaService: VagaService,
              private languageTranslateService: LanguageTranslateService,
              public loadingCtrl: LoadingController) {

    // this.translate = translate;
    // this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    // this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? this._idioma : localStorage.getItem("selectedLanguage");
    // this.translate.use(this.selectedLanguage);

    this.vagaListaEntity = new VagaListaEntity();
  }
  
  ngOnInit() {
    this.getTraducao();
    // this.getVagasCandidatadas();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getVagasCandidatadas();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.getVagasCandidatadas();
      infiniteScroll.complete();
    }, 500);
  }

  getVagasCandidatadas() {
    try {
      this.vagaListaEntity.limiteDados = this.vagaListaEntity.limiteDados ? this.vagas.length : null;

      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT
        });
        this.loading.present();
      }

      this.vagaService.findVagasCandidatadas()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          this.vagas.limiteDados = this.vagas.length;

          console.log(this.vagas);
          this.refresh = true;
          this.loading ? this.loading.dismiss() : '';
          // this.loading.dismiss();
      }, (err) => {
        this.loading ? this.loading.dismiss() : '';
        // this.loading.dismiss();
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
    console.log(idVaga);
    this.navCtrl.push(DetalheVagaPage, {
      idVaga: idVaga,
      candidatado: true
    })
  }

}

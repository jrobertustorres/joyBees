import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-vagas-em-destaque',
  templateUrl: 'vagas-em-destaque.html',
})
export class VagasEmDestaquePage {
  public loading = null;
  private vagas;
  private loadingText: string;

  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private _idioma: string;

  private titleNaoLogado: string;
  private subTitleNaoLogado: string;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private vagaService: VagaService,
              translate: TranslateService,
              public navParams: NavParams) {
    this.translate = translate;
  }

  ngOnInit() {
    this.getLanguage();
    let vagas = [{nome:"Vaga de mecânico de máquinas", descricao:"Concertar máquinas com defeito", cidadeEstadoFormat:"Tsuchima - Aichi", tempoAberto: "10 dias"}];
    console.log(vagas);
    // this.getVagasDestaque();
  }

  ionViewDidLoad() {
  }

  getVagasDestaque() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.getVagasHome()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          console.log(this.vagas );
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

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);

    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    }
    if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Procurando vagas...';
        this.titleNaoLogado = 'Você não está logado!';
        this.subTitleNaoLogado = 'Para se candidatar a alguma vaga, é necessário fazer login!';
      } else {
        this.loadingText = 'Looking for vacancies...';
        this.titleNaoLogado = 'You are not logged in!';
        this.subTitleNaoLogado = 'To apply for a job, you must login!';
      }
    }
    this.translate.use(this.selectedLanguage);
    // this.getVagasDestaque();
  }

}

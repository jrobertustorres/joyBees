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

//PAGES
import { HomePage } from './../home/home';

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
  public idUsuario: string;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private vagaService: VagaService,
              translate: TranslateService,
              public navParams: NavParams) {
    this.translate = translate;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    console.log(this.idUsuario);
  }

  ngOnInit() {
    this.getLanguage();
    let vagas = [{idVaga: "1", nome:"Vaga de mecânico de máquinas", 
                  descricao:"Concertar máquinas com defeito", 
                  cidadeEstadoFormat:"Tsuchima - Aichi", 
                  tempoAberto: "10 dias"},
                  {idVaga: "2", nome:"Operador de empilhadeira", 
                  descricao:"Dirigir empilhadeira", 
                  cidadeEstadoFormat:"Tsuchima - Aichi", 
                  tempoAberto: "10 dias"}
                ];
    this.vagas = vagas;
    // this.getVagasDestaque();
  }

  ionViewDidLoad() {
  }

  getIdVaga(idVaga) {
    console.log(idVaga);
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

  candidatarVaga(idVaga) {
    localStorage.setItem(Constants.ID_VAGA_CANDIDATAR, idVaga);

    if(!localStorage.getItem(Constants.ID_USUARIO)) {
      this.showAlertNaoLogado();
    }
  }

  showAlertNaoLogado() {
    let alert = this.alertCtrl.create({
      title: this.titleNaoLogado,
      subTitle: this.subTitleNaoLogado,
      buttons: ['OK']
    });
    alert.present();
  }

  openLoginPage() {
    this.navCtrl.push(HomePage, {loginPage: true});
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

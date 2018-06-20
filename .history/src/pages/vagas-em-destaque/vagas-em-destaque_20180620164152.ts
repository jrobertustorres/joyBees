import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//PAGES
import { HomePage } from './../home/home';
import { DetalheVagaPage } from '../detalhe-vaga/detalhe-vaga';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro';

@IonicPage()
@Component({
  selector: 'page-vagas-em-destaque',
  templateUrl: 'vagas-em-destaque.html',
})
export class VagasEmDestaquePage {
  public loading = null;
  private vagas;
  private vagasDestaque;
  // private loadingText: string;
  segment: string = "vagasDestaque"; // default button
  private vagaDetalheEntity: VagaDetalheEntity;

  // languages = availableLanguages;
  // selectedLanguage = null;
  // private translate: TranslateService;
  // private _idioma: string;

  // private titleNaoLogado: string;
  // private subTitleNaoLogado: string;
  public idUsuario: string;

  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private vagaService: VagaService,
              public modalCtrl: ModalController,
              translate: TranslateService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    // this.translate = translate;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.vagaDetalheEntity = new VagaDetalheEntity();
  }

  ngOnInit() {
    // this.getLanguage();
    this.getTraducao();
    // let vagasDestaque = [{idVaga: "1", nome:"Vaga de mecânico de máquinas", 
    //               descricao:"Concertar máquinas com defeito", 
    //               cidadeEstadoFormat:"Tsuchima - Aichi", 
    //               tempoAberto: "10 dias"},
    //               {idVaga: "2", nome:"Operador de empilhadeira", 
    //               descricao:"Dirigir empilhadeira", 
    //               cidadeEstadoFormat:"Tsuchima - Aichi", 
    //               tempoAberto: "10 dias"}
    //             ];
    // this.vagasDestaque = vagasDestaque;
    // this.getVagasDestaque();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        // this.getVagasDestaque();
        let vagasDestaque = [{idVaga: "1", nome:"Vaga de mecânico de máquinas", 
                  descricao:"Concertar máquinas com defeito", 
                  cidadeEstadoFormat:"Tsuchima - Aichi", 
                  tempoAberto: "10 dias"},
                  {idVaga: "2", nome:"Operador de empilhadeira", 
                  descricao:"Dirigir empilhadeira", 
                  cidadeEstadoFormat:"Tsuchima - Aichi", 
                  tempoAberto: "10 dias"}
                ];
        this.vagasDestaque = vagasDestaque;
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  // getIdVaga(idVaga) {
  //   console.log(idVaga);
  // }

  getVagasDestaque() { // CHAMAR ESSE METODO QUANDO TIVER VAGAS EM DESTAQUE NO BANCO DE DADOS
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_VAGAS
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

  // candidatarVaga(idVaga) {
  //   localStorage.setItem(Constants.ID_VAGA_CANDIDATAR, idVaga);
  //   console.log(localStorage.getItem(Constants.ID_VAGA_CANDIDATAR));

  //   if(!localStorage.getItem(Constants.ID_USUARIO)) {
  //     this.showAlertNaoLogado();
  //   }
  // }

  showAlertNaoLogado() {
    let alert = this.alertCtrl.create({
      title: this.languageDictionary.MESSAGE_TITLE_NAO_LOGADO,
      subTitle: this.languageDictionary.MESSAGE_SUBTITLE_NAO_LOGADO,
      buttons: ['OK']
    });
    alert.present();
  }

  openLoginPage() {
    this.navCtrl.push(HomePage, {loginPage: true});
  }

  detalheVaga(idVaga) {
    localStorage.setItem(Constants.ID_VAGA_CANDIDATAR, idVaga);
    
    if(!localStorage.getItem(Constants.ID_USUARIO)) {
      this.showAlertNaoLogado();
    } else {
      this.navCtrl.push(DetalheVagaPage, {
        idVaga: idVaga
      })
    }
  }

  // getVagasDestaquePrincipal() {
  //   try {
  //     this.loadingDestaques = this.loadingCtrl.create({
  //       content: this.loadingText
  //     });
  //     this.loadingDestaques.present();

  //     this.vagaService.getVagasHome()
  //       .then((vagasListaEntityResult: VagaListaEntity) => {
  //         this.vagasDestaque = vagasListaEntityResult;
  //         this.loadingDestaques.dismiss();
  //     }, (err) => {
  //       this.loadingDestaques.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });
  //   }
  //   catch (err){
  //     if(err instanceof RangeError){
  //       console.log('out of range');
  //     }
  //     console.log(err);
  //   }
  // }

  doRefreshVagasCidade(refresher) {
    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.getVagasCidade(this.vagaDetalheEntity);

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  selectedTabChanged($event): void {
    if ($event._value == "vagasCidade") {
      this.getVagasCidade(this.vagaDetalheEntity);
    } 
    else {
      if ($event._value == "vagasDestaque") {
        // this.getVagasDestaquePrincipal();
      } 
    }
  }

  openModalFiltro(){
    let modal = this.modalCtrl.create(ModalFiltroPage);

    modal.onDidDismiss((data) => {
      if (data) {
        this.segment = "vagasCidade";
        this.getVagasCidade(data.filter);
      }
    });

    modal.present();
  }

  getVagasCidade(filtro) {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
        // content: this.loadingText
      });
      this.loading.present();

      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity = filtro;

      this.vagaService.getVagasPrincipal(this.vagaDetalheEntity)
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

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);

  //   if(!this.selectedLanguage){
  //     this.selectedLanguage = this._idioma;
  //   }
  //   if(this.selectedLanguage) {
  //     if (this.selectedLanguage == 'pt-br') {
  //       // this.loadingText = 'Procurando vagas...';
  //       // this.titleNaoLogado = 'Você não está logado!';
  //       // this.subTitleNaoLogado = 'Para ver detalhes de alguma vaga, é necessário fazer login!';
  //     } else {
  //       // this.loadingText = 'Looking for vacancies...';
  //       // this.titleNaoLogado = 'You are not logged in!';
  //       // this.subTitleNaoLogado = 'To see details of someone job, you must login!';
  //     }
  //   }
  //   this.translate.use(this.selectedLanguage);
  //   // this.getVagasDestaque();
  // }

}

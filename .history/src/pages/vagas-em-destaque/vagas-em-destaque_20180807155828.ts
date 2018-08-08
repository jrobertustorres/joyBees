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
// import { TranslateService } from '@ngx-translate/core';
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
  // private vagasDestaque;
  // private loadingText: string;
  segment: string = "vagasDestaque"; // default button
  private vagaDetalheEntity: VagaDetalheEntity;
  private vagaListaEntity: VagaListaEntity;

  private limiteDados: number;
  private refresh: boolean = false;

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
              // translate: TranslateService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    // this.translate = translate;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.vagaListaEntity = new VagaListaEntity();
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
        if(this.idUsuario) {
          this.getVagasList(this.vagaDetalheEntity);
        } else {
          this.getVagasDestaque();
        }
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
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    setTimeout(() => {

      if(!localStorage.getItem(Constants.ID_USUARIO)) {
        this.getVagasDestaque();
      } else {
        console.log('qqqqqqqqqqqqqq');
        this.getVagasList(this.vagaDetalheEntity);
      }
      infiniteScroll.complete();
    }, 500);
  }

  getVagasDestaque() {
    try {
      this.limiteDados = this.vagaListaEntity.limiteDados ? this.vagas.length : 0;

      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_VAGAS
        });
        this.loading.present();
      }

      // this.loading = this.loadingCtrl.create({
      //   content: this.languageDictionary.LOADING_VAGAS
      // });
      // this.loading.present();

      this.vagaService.findVagaDestaqueByVaga(this.limiteDados)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult; //mudei para vagas para funcionar quando o usuário não estiver logado
          this.vagas.limiteDados = this.vagas.length;
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

  showAlertNaoLogado() {
    let alert = this.alertCtrl.create({
      title: this.languageDictionary.MESSAGE_TITLE_NAO_LOGADO,
      subTitle: this.languageDictionary.MESSAGE_SUBTITLE_NAO_LOGADO,
      buttons: ['OK']
    });
    alert.present();
  }

  openLoginPage() {
    this.navCtrl.push(HomePage, {loginPage: true}, { animate: true, direction: 'back' });
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

  doRefreshVagasCidade(refresher) {
    this.vagaDetalheEntity = new VagaDetalheEntity();
    this.getVagasList(this.vagaDetalheEntity);

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  // selectedTabChanged($event): void {
  //   console.log('entrei no selected change');
  //   console.log($event);
  //   if ($event._value == "vagasCidade") {
  //     this.getVagasList(this.vagaDetalheEntity);
  //   } 
  //   else {
  //     if ($event._value == "vagasDestaque") {
  //       // this.getVagasDestaquePrincipal();
  //     } 
  //   }
  // }

  openModalFiltro(){
    let modal = this.modalCtrl.create(ModalFiltroPage);

    modal.onDidDismiss((data) => {
      if (data) {
        // this.segment = "vagasCidade";
        this.getVagasList(data.filter);
      }
    });

    modal.present();
  }

  getVagasList(filtro) {
    try {
      // this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity = filtro;

      this.vagaDetalheEntity.limiteDados = this.vagaDetalheEntity.limiteDados ? this.vagas.length : null;

      if(this.vagaDetalheEntity.limiteDados == null) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
          dismissOnPageChange: true
        });
        this.loading.present();
      }

      this.vagaService.getVagasPrincipal(this.vagaDetalheEntity)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          this.vagas.limiteDados = this.vagas.length;
          console.log('aaaaaaaaaa');
          // this.vagaDetalheEntity.limiteDados = this.vagas.length;

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

}

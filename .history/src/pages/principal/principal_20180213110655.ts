import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ModalController } from 'ionic-angular';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//PAGES
import { DetalheVagaPage } from '../detalhe-vaga/detalhe-vaga';
import { ModalFiltroPage } from '../modal-filtro/modal-filtro';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  segment: string = "vagasDestaque"; // default button

  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private vagasDestaque;
  private vagas;
  private loadingText: string;
  private loading = null;
  private loadingDestaques = null;
  private vagaDetalheEntity: VagaDetalheEntity;
  // private qtdVagas: number;
  // private qtdVagasDestaque: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController) {

    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage);
    
    // if (this.selectedLanguage == 'pt-br') {
    //   this.loadingText = 'Procurando vagas...';
    // } else {
    //   this.loadingText = 'Looking for vacancies...';
    // }
    // this.loading = this.loadingCtrl.create({
    //   content: this.loadingText
    // });
    // this.loading.present();

    this.vagaDetalheEntity = new VagaDetalheEntity();

  }

  ngOnInit() {
    this.getLanguage();
    this.getVagasDestaquePrincipal();
    // this.getVagasPrincipal(this.vagaDetalheEntity);
  }

  ionViewDidLoad() {
  }

  doRefresh(refresher) {
    this.getVagasDestaquePrincipal();
    this.getVagasPrincipal(this.vagaDetalheEntity);

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  selectedTabChanged($event): void {
    if ($event._value == 'vagasDestaque') {
      this.getVagasDestaquePrincipal();
    } else {
      this.getVagasPrincipal(this.vagaDetalheEntity);
    }
  }

  openModalFiltro(){
    let modal = this.modalCtrl.create(ModalFiltroPage);

    modal.onDidDismiss((data) => {
      this.getVagasPrincipal(data.filter);
    });

    modal.present();
  }

  getVagasDestaquePrincipal() {
    try {
      this.loadingDestaques = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loadingDestaques.present();

      this.vagaService.getVagasHome()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagasDestaque = vagasListaEntityResult;
          this.loadingDestaques.dismiss();
      }, (err) => {
        this.loadingDestaques.dismiss();
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

  getVagasPrincipal(filtro) {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity = filtro;

      this.vagaService.getVagasPrincipal(filtro)
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

  detalheVaga(idVaga) {
    this.navCtrl.push(DetalheVagaPage, {
      idVaga: idVaga,
      candidatado: false
    })
  }

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.loadingText = 'Procurando vagas...';
    } else {
      this.loadingText = 'Looking for vacancies...';
    }
  }

}

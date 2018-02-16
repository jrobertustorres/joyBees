import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ModalController } from 'ionic-angular';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';

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
  private vagas;
  private loadingText: string;
  private loading = null;
  // private qtdVagas: number;

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
    
    if (this.selectedLanguage == 'pt-br') {
      this.loadingText = 'Procurando vagas...';
    } else {
      this.loadingText = 'Looking for vacancies...';
    }
    this.loading = this.loadingCtrl.create({
      content: this.loadingText
    });
    this.loading.present();

  }

  ngOnInit() {
    this.getVagasPrincipal();
  }

  ionViewDidLoad() {
  }

  // presentPopover(myEvent) {
  //   let popover = this.popoverCtrl.create(PopoverPrincipalPage);
  //   popover.present({
  //     ev: myEvent
  //   });
  // }

  doRefresh(refresher) {
    this.getVagasDestaquePrincipal();
    this.getVagasPrincipal();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  openModalFiltro(){
    let modal = this.modalCtrl.create(ModalFiltroPage);
    modal.present();
  }

  getVagasDestaquePrincipal() {
    try {

      this.vagaService.getVagasHome()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          // this.qtdVagas = this.vagas.length;
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

  getVagasPrincipal() {
    try {

      this.vagaService.getVagasPrincipal()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          // this.qtdVagas = this.vagas.length;
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

}

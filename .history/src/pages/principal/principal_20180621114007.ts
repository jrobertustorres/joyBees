import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, PopoverController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
// import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
// import { VagaListaEntity } from '../../model/vaga-lista-entity';
// import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//PAGES
import { VagasEmDestaquePage } from './../vagas-em-destaque/vagas-em-destaque';
// import { FornecedoresEmDestaquePage } from '../fornecedores-em-destaque/fornecedores-em-destaque';
import { NovoOrcamentoPage } from '../novo-orcamento/novo-orcamento';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  public languageDictionary: any;
  // segment: string = "vagasDestaque"; // default button

  // languages = availableLanguages;
  // private selectedLanguage = null;
  private translate: TranslateService;
  // private _idioma: string;

  // private vagasDestaque;
  // private vagas;
  // private loadingText: string;
  // private loading = null;
  // private loadingDestaques = null;
  // private vagaDetalheEntity: VagaDetalheEntity;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              // private vagaService: VagaService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private languageTranslateService: LanguageTranslateService,
              public popoverCtrl: PopoverController) {

    // this.translate = translate;

    // this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    // this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
    // this.translate.use(localStorage.getItem(Constants.IDIOMA_USUARIO));
    
  }

  ngOnInit() {
    this.getTraducao();
    // this.findPublicidadePropaganda(); //  A PUBLICIDADE TAMBÉM DEVE OBEDECER O IDIOMA DO USUÁRIO
    // this.getVagasDestaquePrincipal();
  }

  ionViewDidLoad() {
  }

  // ionViewDidEnter() {
  //   this.getTraducao();
  // }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.findPublicidadePropaganda();

      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  findPublicidadePropaganda() {
    try {
      // this.loading = this.loadingCtrl.create({
      //   content: this.loadingText
      // });
      // this.loading.present();

      // this.homeService.findPublicidadePropaganda()
      // .then((propagandasResult: PublicidadePropagandaEntity) => {
      //   this.propagandas = propagandasResult;

      //   this.loading.dismiss();
      // }, (err) => {
      //   this.loading.dismiss();
      //   this.alertCtrl.create({
      //     subTitle: err.message,
      //     buttons: ['OK']
      //   }).present();
      // });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  // doRefreshDestaques(refresher) {
  //   this.getVagasDestaquePrincipal();

  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  // }

  // doRefreshVagasCidade(refresher) {
  //   this.vagaDetalheEntity = new VagaDetalheEntity();
  //   this.getVagasPrincipal(this.vagaDetalheEntity);

  //   setTimeout(() => {
  //     refresher.complete();
  //   }, 2000);
  // }

  // selectedTabChanged($event): void {
  //   if ($event._value == "vagasCidade") {
  //     this.getVagasPrincipal(this.vagaDetalheEntity);
  //   } 
  //   else {
  //   if ($event._value == "vagasDestaque") {
  //     this.getVagasDestaquePrincipal();
  //   } else {
  //     this.getVagasPrincipal(this.vagaDetalheEntity);
  //   }
  // }

  // openModalFiltro(){
  //   let modal = this.modalCtrl.create(ModalFiltroPage);

  //   modal.onDidDismiss((data) => {
  //     if (data) {
  //       this.segment = "vagasCidade";
  //       this.getVagasPrincipal(data.filter);
  //     }
  //   });

  //   modal.present();
  // }

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

  // getVagasPrincipal(filtro) {
  //   try {

  //     this.loading = this.loadingCtrl.create({
  //       content: this.loadingText
  //     });
  //     this.loading.present();

  //     this.vagaDetalheEntity = new VagaDetalheEntity();
  //     this.vagaDetalheEntity = filtro;

  //     this.vagaService.getVagasPrincipal(this.vagaDetalheEntity)
  //       .then((vagasListaEntityResult: VagaListaEntity) => {
  //         this.vagas = vagasListaEntityResult;

  //         this.loading.dismiss();
  //     }, (err) => {
  //       this.loading.dismiss();
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

  // detalheVaga(idVaga) {
  //   this.navCtrl.push(DetalheVagaPage, {
  //     idVaga: idVaga
  //   })
  // }

  goVagasEmDestaque() {
    this.navCtrl.push(VagasEmDestaquePage);
  }
  
  goFornecedoresEmDestaque() {
    this.navCtrl.push(NovoOrcamentoPage);
  }

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
  //   // this._storage.get('selectedLanguage').then((selectedLanguage) => {
  //       if(!this.selectedLanguage){
  //         this.selectedLanguage = this._idioma;
  //       }
  //       else if(this.selectedLanguage) {
  //         this.selectedLanguage = this.selectedLanguage;
  //         if (this.selectedLanguage == 'pt-br') {
  //           this.loadingText = 'Procurando vagas...';
  //         } else {
  //           this.loadingText = 'Looking for vacancies...';
  //         }
  //       }
  //       // this.getVagasDestaquePrincipal();
  //       this.translate.use(this.selectedLanguage);

  //     // });

  // }

}
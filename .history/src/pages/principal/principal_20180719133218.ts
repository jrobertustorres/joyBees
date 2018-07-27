import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, LoadingController, AlertController, PopoverController, ModalController, Slides } from 'ionic-angular';
import { Constants } from '../../app/constants';
import {DomSanitizer} from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
// import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { PublicidadePropagandaService } from '../../providers/publicidade-propaganda-service';

//ENTITYS
// import { VagaListaEntity } from '../../model/vaga-lista-entity';
// import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';
import { PublicidadePropagandaEntity } from '../../model/publicidade-propaganda-entity';

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
  @ViewChild(Slides) slides: Slides;
  public languageDictionary: any;
  // segment: string = "vagasDestaque"; // default button

  // languages = availableLanguages;
  // private selectedLanguage = null;
  private translate: TranslateService;
  // private _idioma: string;

  // private vagasDestaque;
  // private vagas;
  // private loadingText: string;
  private loading = null;
  private propagandas: any;
  // private loadingDestaques = null;
  private publicidadePropagandaEntity: PublicidadePropagandaEntity;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              // private vagaService: VagaService,
              private languageProvider: LanguageProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              private sanitizer: DomSanitizer,
              private geolocation: Geolocation,
              private diagnostic: Diagnostic,
              private locationAccuracy: LocationAccuracy,
              private languageTranslateService: LanguageTranslateService,
              public platform: Platform,
              private publicidadePropagandaService: PublicidadePropagandaService,
              public popoverCtrl: PopoverController) {

    this.translate = translate;
    this.translate.use(localStorage.getItem(Constants.IDIOMA_USUARIO));
    this.publicidadePropagandaEntity = new PublicidadePropagandaEntity();
    
  }

  ngOnInit() {
    this.getTraducao();
    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
      this.getTraducaoEmited(); // aqui temos a chamar novamente para funcionar a alteração da linguagem no menu
    });
    // this.findPublicidadePropaganda(); //  A PUBLICIDADE TAMBÉM DEVE OBEDECER O IDIOMA DO USUÁRIO
  }

  ionViewDidLoad() {
  }

  // ionViewDidEnter() {
  // }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;

      if (this.platform.is('cordova')) {
        this.getGpsStatus(); // DESCOMENTAR AQUI PARA USAR NO CELULAR
      } else {
        this.getGpsPosition(); // COMENTAR AQUI PARA USAR NO CELULAR
      }

      });
    }
    catch (err){
      if(err instanceof RangeError){
        // console.log('out of range');
      }
      console.log(err);
    }
  }

  getTraducaoEmited() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        // this.constroiMenu();

      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
  }

  findPublicidadePropaganda(latitudePes, longitudePes) {
    try {
      // this.loading = this.loadingCtrl.create({
      //   content: this.languageDictionary.LOADING_TEXT
      // });
      // this.loading.present();

      this.publicidadePropagandaEntity.latitudePes = latitudePes;
      this.publicidadePropagandaEntity.longitudePes = longitudePes;
      // this.publicidadePropagandaEntity.latitudePes = -18.9693729;
      // this.publicidadePropagandaEntity.longitudePes = -48.2748947;

      this.publicidadePropagandaService.findPublicidadePropaganda(this.publicidadePropagandaEntity)
      .then((propagandasResult: PublicidadePropagandaEntity) => {
        this.propagandas = propagandasResult;

        console.log(this.propagandas);

        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });

    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  getGpsStatus() {
    let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
    let errorCallback = (e) => console.error(e);
      
      this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);
      
      // only android
      this.diagnostic.isGpsLocationEnabled().then(successCallback, errorCallback);

      this.diagnostic.isLocationEnabled()
      .then((state) => {
        if (state == true) {
          this.getGpsPosition();
        } else {
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if(canRequest) {
              // the accuracy option will be ignored by iOS
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(
                () => this.getGpsPosition(),
                error => this.showLocationText()
              );
            }
          
          });
        }
      }).catch(e => console.error(e));
  }

  getGpsPosition() {
    this.loading = this.loadingCtrl.create({
      content: this.languageDictionary.LOADING_TEXT
    });
    this.loading.present();

    this.geolocation.getCurrentPosition().then((resp) => {
      this.findPublicidadePropaganda(resp.coords.latitude, resp.coords.longitude);
      // this.lancarOrcamento(resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    //  this.loading.dismiss();
  }

  showLocationText() {
    let prompt = this.alertCtrl.create({
      title: this.languageDictionary.MESSAGE_TITLE_LOCATION,
      message: this.languageDictionary.MESSAGE_SUBTITLE_LOCATION,
      buttons: [
        {
          text: 'OK!',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

  goVagasEmDestaque() {
    this.navCtrl.push(VagasEmDestaquePage);
  }
  
  goFornecedoresEmDestaque() {
    this.navCtrl.push(NovoOrcamentoPage);
  }

  lancarOrcamentoByIdFornecedor() {
    this.navCtrl.push(NovoOrcamentoPage);
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

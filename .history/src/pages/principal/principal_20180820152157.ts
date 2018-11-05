import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, LoadingController, AlertController, PopoverController, ModalController, Slides, ToastController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { DomSanitizer } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { InAppBrowser, InAppBrowserOptions } from "@ionic-native/in-app-browser";

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { PublicidadePropagandaService } from '../../providers/publicidade-propaganda-service';
import { OrcamentoService } from './../../providers/orcamento-service';
import { VersaoAppService } from '../../providers/versao-app-service';

//ENTITYS
import { PublicidadePropagandaEntity } from '../../model/publicidade-propaganda-entity';
import { OrcamentoEntity } from './../../model/orcamento-entity';
import { ServicoOrcamentoEntity } from '../../model/servico-orcamento-entity';
import { VersaoAppEntity } from '../../model/versao-app-entity';

//PAGES
import { VagasEmDestaquePage } from './../vagas-em-destaque/vagas-em-destaque';
import { NovoOrcamentoPage } from '../novo-orcamento/novo-orcamento';
import { ModalInformacoesPorSevicoPage } from '../modal-informacoes-por-sevico/modal-informacoes-por-sevico';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  @ViewChild(Slides) slides: Slides;
  public languageDictionary: any;
  private orcamentoEntity: OrcamentoEntity;
  private servicoOrcamentoEntity: ServicoOrcamentoEntity;
  private versaoAppEntity: VersaoAppEntity;
  private versao: any;
  // segment: string = "vagasDestaque"; // default button

  private translate: TranslateService;
  private loading = null;
  private propagandas: any;
  private publicidadePropagandaEntity: PublicidadePropagandaEntity;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              private versaoAppService: VersaoAppService,
              private inAppBrowser: InAppBrowser,
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
              private toastCtrl: ToastController,
              private orcamentoService: OrcamentoService,
              private publicidadePropagandaService: PublicidadePropagandaService,
              public popoverCtrl: PopoverController) {

    this.translate = translate;
    this.translate.use(localStorage.getItem(Constants.IDIOMA_USUARIO));
    this.publicidadePropagandaEntity = new PublicidadePropagandaEntity();
    this.orcamentoEntity = new OrcamentoEntity();
    this.versaoAppEntity = new VersaoAppEntity();
    
  }

  ngOnInit() {
    this.getTraducao();
    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
      this.getTraducaoEmited(); // aqui temos a chamar novamente para funcionar a alteração da linguagem no menu
    });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getAtualizacaoStatus();
      });
    }
    catch (err){
      if(err instanceof RangeError){
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

      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.languageDictionary.MESSAGE_PEDIDO_LANCADO,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  slideChanged() {
    this.slides.autoplayDisableOnInteraction = false;
  }

  findPublicidadePropaganda(latitudePes, longitudePes) {
    try {

      this.publicidadePropagandaEntity.latitudePes = latitudePes;
      this.publicidadePropagandaEntity.longitudePes = longitudePes;
      // this.publicidadePropagandaEntity.latitudePes = -18.9693729;
      // this.publicidadePropagandaEntity.longitudePes = -48.2748947;

      this.publicidadePropagandaService.findPublicidadePropaganda(this.publicidadePropagandaEntity)
      .then((propagandasResult: PublicidadePropagandaEntity) => {
        this.propagandas = propagandasResult;

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
    // this.loading = this.loadingCtrl.create({
    //   content: this.languageDictionary.LOADING_TEXT
    // });
    // this.loading.present();

    this.geolocation.getCurrentPosition().then((resp) => {
      this.findPublicidadePropaganda(resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
        this.loading.dismiss();
     });
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

  getAtualizacaoStatus() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.versaoAppEntity.versao = localStorage.getItem(Constants.VERSION_NUMBER);

      this.versaoAppService.versaoApp(this.versaoAppEntity)
      .then((versaoResult: VersaoAppEntity) => {
        this.versao = versaoResult;

        if(this.versao.descontinuado == false) { //voltar para true
          this.loading.dismiss();
          this.showAlertVersao(this.versao);
        } else {
          if (this.platform.is('cordova')) {
            this.getGpsStatus();
          } else {
            this.getGpsPosition();
          }
        }

        // this.loading.dismiss();
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

  showAlertVersao(versao) {
    const alert = this.alertCtrl.create({
      title: this.languageDictionary.TITLE_ATUALIZACAO_APP,
      subTitle: this.languageDictionary.SUBTITLE_ATUALIZACAO_APP,
      buttons: [
        {
        text: 'OK',
          handler: () => {
            this.getPlatform(versao);
          }
      }]
    });
    alert.present();
  }

  getPlatform(versao) {
    if (this.platform.is('ios')) {
      this.inAppBrowser.create(versao.linkIos, '_system', 'location=yes');
      // const browser = this.inAppBrowser.create(url, '_self', options);
      this.platform.exitApp();
    }

    if (this.platform.is('android')) {
      // This will only print when on iOS
      console.log('I am an android device!');
      window.open("www.google.com", '_system', 'location=yes');
      // window.open('"'+versao.linkAndroid+'"', '_system', 'location=yes');
      this.platform.exitApp();
    }
    
  }

  // ESSA PARTE FICARÁ PARA DEPOIS
  // openModalMaisInformacoesPrincipal(idServicoFornecedor, quantidadeObrigatorio, nomeServico){
  //   let modal = this.modalCtrl.create(ModalInformacoesPorSevicoPage, {idServicoFornecedor: idServicoFornecedor, 
  //     quantidadeObrigatorio: quantidadeObrigatorio, nomeServico: nomeServico});

  //   modal.onDidDismiss((data) => {
  //     if (data) {
  //       this.lancarPedidoDireto(data.filter);
  //     }
  //   });

  //   modal.present();
  // }

  // lancarPedidoDireto(filtro) {

  //   try {
  //     this.loading = this.loadingCtrl.create({
  //       content: this.languageDictionary.LOADING_TEXT
  //     });
  //     this.loading.present();

  //     this.servicoOrcamentoEntity = new ServicoOrcamentoEntity();
  //     this.orcamentoEntity.servicoOrcamentoEntity = filtro;

  //     this.orcamentoService
  //     .lancarOrcamentoServicoPublicidade(this.orcamentoEntity)
  //     .then((orcamentoEntityResult: OrcamentoEntity) => {
  //       this.loading.dismiss();
  //       this.presentToast();
  //     }, (err) => {
  //       this.loading.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });

  //   } catch (err){
  //     if(err instanceof RangeError){
  //       console.log('out of range');
  //     }
  //     console.log(err);
  //   }
    
  // }


}

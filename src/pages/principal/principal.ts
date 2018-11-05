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

  private translate: TranslateService;
  private loading = null;
  private propagandas: any;
  private publicidadePropagandaEntity: PublicidadePropagandaEntity;
  private latitudeResp: number;
  private longitudeResp: number;

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
    //aqui obrigo a tela a chamar o método a partir da segunda vez que
    //entra para sempre buscar as publicidades mais recentes
    if(this.latitudeResp && this.longitudeResp) {
      this.findPublicidadePropaganda(this.latitudeResp, this.longitudeResp);
    }
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        // this.getAtualizacaoStatus();
        if (this.platform.is('cordova')) {
          this.getGpsStatus();
        } else {
          this.getGpsPosition();
        }
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

  // AQUI PODEMOS MANDAR A PUBLICIDADE CONFORME AS COORDENADAS - mostrar promoção quando próximo ao local
  findPublicidadePropaganda(latitudePes, longitudePes) {
    try {
      this.propagandas = null;// limpo aqui para carregar novas publicidades caso tenha atualização
      this.publicidadePropagandaEntity.latitudePes = latitudePes;
      this.publicidadePropagandaEntity.longitudePes = longitudePes;

      this.publicidadePropagandaService.findPublicidadePropaganda(this.publicidadePropagandaEntity)
      .then((propagandasResult: PublicidadePropagandaEntity) => {
        this.propagandas = propagandasResult;
        // setTimeout(() => {
        //   this.propagandas = propagandasResult;
        // }, 500);
      }, (err) => {
        // this.loading.dismiss();
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

  openLink(linkPublicidade) {
    window.open(linkPublicidade, '_system', 'location=yes');
  }

  getGpsStatus() {
    let successCallback = (isAvailable) => { console.log('Is available? ' + isAvailable); };
    let errorCallback = (e) => console.error(e);

      this.diagnostic.isLocationEnabled().then(successCallback).catch(errorCallback);

      // only android
      this.diagnostic.isGpsLocationEnabled().then(successCallback, errorCallback);

      this.diagnostic.isLocationEnabled()
      .then((state) => {
        console.log('dentro do then');
        if (state == true) {
          console.log('dentro state true');
          this.getGpsPosition();
        } else {
          console.log('dentro accuracy');
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            console.log('dentro do then do accuracy');
            if(canRequest) {
              console.log('dentro do canRequest');
              // the accuracy option will be ignored by iOS
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(() => {
                console.log('dentro do then do canRequest ===> ');
                this.getGpsPosition();
              }).catch((error) => {
                this.showLocationText();
               });
            }

          });
        }
      }).catch(e => console.error(e));
  }

  getGpsPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitudeResp = resp.coords.latitude;
      this.longitudeResp = resp.coords.longitude;
      this.findPublicidadePropaganda(resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       // aqui mandamos as propagandas padrão. Podemos mandar outras aleatórias ou definidas para esse caso
      this.findPublicidadePropaganda(0, 0);
     });
  }

  showLocationText() {
    let prompt = this.alertCtrl.create({
      title: this.languageDictionary.MESSAGE_TITLE_LOCATION,
      message: this.languageDictionary.MESSAGE_SUBTITLE_LOCATION,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.findPublicidadePropaganda(0,0);
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

}

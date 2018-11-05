import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, LoadingController, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Constants } from '../../app/constants';

//SERVICES
import { ServicoService } from './../../providers/servico-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { OrcamentoService } from './../../providers/orcamento-service';

//ENTITYS
import { ServicoListEntity } from '../../model/servico-list-entity';
import { OrcamentoEntity } from './../../model/orcamento-entity';

//PAGES
import { ModalInformacoesPorSevicoPage } from '../modal-informacoes-por-sevico/modal-informacoes-por-sevico';
import { PrincipalPage } from './../principal/principal';
import { HomePage } from '../home/home';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

@IonicPage()
@Component({
  selector: 'page-novo-orcamento',
  templateUrl: 'novo-orcamento.html',
})
export class NovoOrcamentoPage {
  public loading = null;
  private servicoListEntity: ServicoListEntity;
  private listaServicos: any;
  private listServicoResposta: any;
  private listServicoRespostaChild: any[] = [];
  private servicosSelecionados: any[] = [];
  private auxIndex = null;
  public serviceChecked = false;
  public dadosOrcamento: any[] = [];
  public languageDictionary: any;
  private orcamentoEntity: OrcamentoEntity;
  public idUsuario: string;

  public valueI: any;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              private orcamentoService: OrcamentoService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private geolocation: Geolocation,
              private diagnostic: Diagnostic,
              private locationAccuracy: LocationAccuracy,
              private toastCtrl: ToastController,
              public platform: Platform,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.servicoListEntity = new ServicoListEntity();
    this.orcamentoEntity = new OrcamentoEntity();
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);

  }

  ngOnInit() {
    this.getTraducao();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getMapServico();
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

    setTimeout(() => {

      this.getMapServico();
      infiniteScroll.complete();
    }, 500);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.languageDictionary.MESSAGE_ORCAMENTO_LANCADO,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getMapServico() {
    try {
      this.servicoListEntity.limitDados = this.servicoListEntity.limitDados ? this.listaServicos.length : null;

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();
      this.servicoService.findMapServico(this.servicoListEntity)
        .then((servicoListEntityResult: ServicoListEntity) => {
          this.listaServicos = servicoListEntityResult;
          this.servicoListEntity.limitDados = this.listaServicos.length;

          this.listServicoResposta = servicoListEntityResult;

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

  toggleSection(i) {
    this.valueI = i;

    if(this.auxIndex == i || this.auxIndex == null) {
      this.auxIndex = i;
    }

    if(this.auxIndex!=i) {
      this.listServicoResposta[this.auxIndex].open = false;
      this.auxIndex = i;
    }

    this.listServicoRespostaChild = this.listServicoResposta[i].listServicos;
    this.listServicoResposta[i].open = !this.listServicoResposta[i].open;

    for(let i=0; i < this.listServicoRespostaChild.length; i++) {
      this.listServicoRespostaChild[i].serviceChecked = false;
      for(let j=0; j < this.servicosSelecionados.length; j++) {
        if (this.listServicoRespostaChild[i].idServico == this.servicosSelecionados[j]) {
          this.listServicoRespostaChild[i].serviceChecked = true;
        }
      }
    }

  }

  servicosChecked(idServico, nomeServico, quantidadeObrigatorio) {
    let index = this.servicosSelecionados.indexOf(idServico);

    if (index != -1) {
      this.servicosSelecionados.splice(index, 1);
      this.dadosOrcamento.splice(index, 1);
    } else {
      this.servicosSelecionados.push(idServico);
      this.openModalMaisInformacoes(idServico, nomeServico, quantidadeObrigatorio);
    }

    for(let i=0; i < this.listServicoRespostaChild.length; i++) {
      this.listServicoRespostaChild[i].serviceChecked = false;
      for(let j=0; j < this.servicosSelecionados.length; j++) {
        if (this.listServicoRespostaChild[i].idServico == this.servicosSelecionados[j]) {
          this.listServicoRespostaChild[i].serviceChecked = true;
        }
      }
    }

  }

  verificaServicosSelecionados() {
    if(localStorage.getItem(Constants.IS_CADASTRO_COMPLETO_SERVICO)){
      if(this.servicosSelecionados.length > 0) {
        if (this.platform.is('cordova')) {
          this.getGpsStatus();
        } else {
          this.getGpsPosition();
        }

      } else {
        this.showAlert();
      }
    } else {
      this.showAlertCadastroCompleto();
    }

  }

  showAlertCadastroCompleto() {
    const confirm = this.alertCtrl.create({
      title: this.languageDictionary.ENDEREÇO_IMCOPLETO_TEXT,
      subTitle: this.languageDictionary.MESSAGE_SUBTIBLE_CADASTRO_INCOMPLETO_SERVICO,
      buttons: [
        {
          text: this.languageDictionary.CANCELAR,
          handler: () => {
          }
        },
        {
          text: this.languageDictionary.BTN_CONFIG,
          handler: () => {
            this.navCtrl.setRoot(ConfiguracoesPage,{}, { animate: true, direction: 'back' });
          }
        }
      ]
    });
    confirm.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: this.languageDictionary.MESSAGE_TITLE_FALHA,
      subTitle: this.languageDictionary.MESSAGE_SUBTITLE_FALHA,
      buttons: ['OK']
    });
    alert.present();
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
                error => this.lancarOrcamento(0, 0) //lanço de toda forma
                // error => this.showLocationText()
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
      // pegamos as coords para ir lançando pra quem está mais perto - no inicio vamos lançar para todos os fornecedores
      this.lancarOrcamento(resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       // mesmo se não pegarmos a posição, lançamos para todos os fornecedores
       // aqui verificar se não pegou chamar novamente
      this.lancarOrcamento(0, 0);
     });
  }

  lancarOrcamento(latitude, longitude) {

    try {

      if(latitude == 0 && longitude == 0) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT
        });
        this.loading.present();
      }
      this.orcamentoEntity.latitudePes = latitude;
      this.orcamentoEntity.longitudePes = longitude;
      this.orcamentoEntity.limitDados = 0;
      this.orcamentoEntity.listServicoOrcamento = this.dadosOrcamento;

      this.orcamentoService
      .lancarOrcamentoServico(this.orcamentoEntity)
      .then((orcamentoEntityResult: OrcamentoEntity) => {
        this.loading.dismiss();
        this.presentToast();
        setTimeout(() => {
          this.navCtrl.setRoot(PrincipalPage);
        }, 3000);
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });

    } catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }

  }

  showLocationText() {
    let prompt = this.alertCtrl.create({
      title: this.languageDictionary.MESSAGE_TITLE_LOCATION,
      message: this.languageDictionary.MESSAGE_SUBTITLE_LOCATION,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.lancarOrcamento(0,0);
          }
        }
      ]
    });
    prompt.present();
  }

  openModalMaisInformacoes(idServico, nomeServico, quantidadeObrigatorio){
    let modal = this.modalCtrl.create(ModalInformacoesPorSevicoPage,
      {idServico: idServico, nomeServico: nomeServico, quantidadeObrigatorio: quantidadeObrigatorio});

    modal.onDidDismiss((data) => {

      if (data) {
        this.dadosOrcamento.push(data.filter);
        this.showConfirm();
      } else {

        for(let i=0; i < this.listServicoRespostaChild.length; i++) {
          for(let j=0; j < this.servicosSelecionados.length; j++) {
            if (this.listServicoRespostaChild[i].idServico == this.servicosSelecionados[j]) {
              this.listServicoRespostaChild[i].serviceChecked = false;
            }
          }
        }

        let index = this.servicosSelecionados.indexOf(idServico);

        if (index != -1) {
          this.servicosSelecionados.splice(index, 1);
        } else {
          this.servicosSelecionados.push(idServico);
          this.openModalMaisInformacoes(idServico, nomeServico, quantidadeObrigatorio);
        }
      }
    });

    modal.present();
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Adicionado ao orçamento',
      message: 'O produto/serviço foi adicionado ao orçamento',
      buttons: [
        {
          text: 'Adicionar mais itens',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Lançar orçamento agora',
          handler: () => {
            this.verificaServicosSelecionados();
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  goToLogin() {
    this.navCtrl.push(HomePage, {loginPage: true}, { animate: true, direction: 'back' });
  }


}

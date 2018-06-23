import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

//SERVICES
import { ServicoService } from './../../providers/servico-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { ServicoListEntity } from '../../model/servico-list-entity';
import { OrcamentoEntity } from './../../model/orcamento-entity';

//PAGES
import { ModalInformacoesPorSevicoPage } from '../modal-informacoes-por-sevico/modal-informacoes-por-sevico';

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

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private geolocation: Geolocation,
              private diagnostic: Diagnostic,
              private locationAccuracy: LocationAccuracy,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.servicoListEntity = new ServicoListEntity();
    this.orcamentoEntity = new OrcamentoEntity();
  }

  ngOnInit() {
    // this.contador = 0;
    this.getTraducao();
    // this.getMapServico();
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

  getMapServico() {
    try {
      this.servicoListEntity.limitDados = this.servicoListEntity.limitDados ? this.listaServicos.length : null;

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();
      this.servicoService.findMapServico(this.servicoListEntity)
        .then((servicoListEntityResult: ServicoListEntity) => {
          this.listaServicos = servicoListEntityResult;
          this.servicoListEntity.limitDados = this.listaServicos.length;

          this.listServicoResposta = servicoListEntityResult;

          console.log(this.listaServicos);

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

  servicosChecked(idServico) {
    let index = this.servicosSelecionados.indexOf(idServico);

    if (index != -1) {
      this.servicosSelecionados.splice(index, 1);
    } else {
      this.servicosSelecionados.push(idServico);
      this.openModalMaisInformacoes(idServico);
    }

  }

  verificaServicosSelecionados() {
    if(this.servicosSelecionados.length > 0) {
      this.getGpsPosition(); // COMENTAR AQUI PARA USAR NO CELULAR
      // this.getGpsStatus(); // DESCOMENTAR AQUI PARA USAR NO CELULAR
      
    } else {
      this.showAlert();
    }

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
      console.log(resp.coords);
      this.lancarOrcamento(resp.coords.latitude, resp.coords.longitude);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    //  this.loading.dismiss();
  }

  lancarOrcamento(latitude, longitude) {
    console.log(this.servicosSelecionados); // ONDE VOU PASSAR ESSES DADOS? EM UMA LISTA??
    
    console.log(this.dadosOrcamento);
    // this.orcamentoEntity.latitude = latitude; //  dentro do FiltroEntity
    this.orcamentoEntity.filtroEntity.latitude = latitude; 
    this.orcamentoEntity.filtroEntity.longitude = longitude; 
    this.orcamentoEntity.listServicoOrcamento = this.dadosOrcamento;
    // this.dadosOrcamento // passar dentro de uma lista ServicoOrcamentoEntity
    console.log(this.orcamentoEntity);
    this.loading.dismiss();

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

  openModalMaisInformacoes(idServico){
    let modal = this.modalCtrl.create(ModalInformacoesPorSevicoPage, {idServico: idServico});

    modal.onDidDismiss((data) => {
      if (data) {
        console.log(data);
        this.dadosOrcamento.push(data.filter);
        // let idCidadeFiltro = data.filter.idCidade ? data.filter.idCidade : data.filter.idCidade;
        // this.openOficinasList(idServico, idCidadeFiltro, this.idVeiculo);
      }
    });

    modal.present();
  }


}

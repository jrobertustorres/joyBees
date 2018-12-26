import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, FabContainer } from 'ionic-angular';

//ENTITYS
import { DetalheCotacaoEntity } from '../../model/detalhe-cotacao-entity';

//SERVICES
import { OrcamentoService } from '../../providers/orcamento-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//PAGES
import { OrcamentoPrincipalPage } from '../orcamento-principal/orcamento-principal';
import { ModalImagemFornecedorPage } from '../modal-imagem-fornecedor/modal-imagem-fornecedor';
import { ModalAvaliacaoServicoFornecedorPage } from '../modal-avaliacao-servico-fornecedor/modal-avaliacao-servico-fornecedor';

@IonicPage()
@Component({
  selector: 'page-detalhe-cotacao',
  templateUrl: 'detalhe-cotacao.html',
})
export class DetalheCotacaoPage {
  // private cotacaoEntity: CotacaoEntity;
  private detalheCotacaoEntity: DetalheCotacaoEntity;
  public idCotacao: number;
  // public idFornecedor: number;
  public idServicoFornecedor: number;
  private loading = null;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private orcamentoService: OrcamentoService,
              private toastCtrl: ToastController,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.detalheCotacaoEntity = new DetalheCotacaoEntity();
    this.idCotacao = navParams.get('idCotacao');
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
        this.detalheCotacao();
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
      message: this.languageDictionary.TOAST_ORCAMENTO_ESCOLHIDO,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  detalheCotacao() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.detalheCotacaoEntity.idCotacao = this.idCotacao;

      this.orcamentoService.detalhaCotacao(this.detalheCotacaoEntity)
      .then((detalheCotacaoEntityResult: DetalheCotacaoEntity) => {
        this.detalheCotacaoEntity = detalheCotacaoEntityResult;

        this.idServicoFornecedor = this.detalheCotacaoEntity.idServicoFornecedor;

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

  escolherCotacaoConfirm() {
    let confirm = this.alertCtrl.create({
      title: this.languageDictionary.TITLE_ESCOLHA_ORCAMENTO,
      message: this.languageDictionary.SUBTITLE_ESCOLHA_ORCAMENTO,
      buttons: [
        {
          text: this.languageDictionary.CANCELAR_UPPER,
          handler: () => {
          }
        },
        {
          text: this.languageDictionary.BTN_CONFIRMAR,
          handler: () => {
            this.escolherCotacao();
          }
        }
      ]
    });
    confirm.present();
  }

  escolherCotacao() {
    this.detalheCotacaoEntity.idCotacao = this.idCotacao;

    this.loading = this.loadingCtrl.create({
      content: this.languageDictionary.LOADING_TEXT,
    });
    this.loading.present();

    this.orcamentoService.escolherCotacao(this.detalheCotacaoEntity)
      .then((detalheCotacaoEntityResult: DetalheCotacaoEntity) => {
        this.loading.dismiss();
        this.presentToast();
        setTimeout(() => {
        this.navCtrl.setRoot(OrcamentoPrincipalPage);
        }, 3000);
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });
  }

  modalAvaliacao() {
    let modal = this.modalCtrl.create(ModalAvaliacaoServicoFornecedorPage, {idCotacao: this.detalheCotacaoEntity.idCotacao});
    modal.present();
  }

  modalImagensFornecedor() {
    let modal = this.modalCtrl.create(ModalImagemFornecedorPage, {idServicoFornecedor: this.idServicoFornecedor});
    modal.present();
  }

}

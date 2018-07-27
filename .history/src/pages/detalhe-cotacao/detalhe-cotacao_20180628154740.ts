import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, FabContainer } from 'ionic-angular';

//ENTITYS
import { CotacaoEntity } from '../../model/cotacao-entity';
import { DetalheOrcamentoEntity } from './../../model/detalhe-orcamento-entity';
import { DetalheServicoOrcamentoEntity } from '../../model/detalhe-servico-orcamento-entity';

//SERVICES
import { OrcamentoService } from '../../providers/orcamento-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//PAGES
// import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-detalhe-cotacao',
  templateUrl: 'detalhe-cotacao.html',
})
export class DetalheCotacaoPage {
  private cotacaoEntity: CotacaoEntity;
  // private detalheOrcamentoEntity: DetalheOrcamentoEntity;
  private detalheServicoOrcamentoEntity: DetalheServicoOrcamentoEntity;
  public idServicoOrcamento: number;
  public idFornecedor: number;
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
    this.cotacaoEntity = new CotacaoEntity();
    // this.detalheOrcamentoEntity = new DetalheOrcamentoEntity();
    this.detalheServicoOrcamentoEntity = new DetalheServicoOrcamentoEntity();
    this.idServicoOrcamento = navParams.get('idServicoOrcamento');
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
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.detalheServicoOrcamentoEntity.idServicoOrcamento = this.idServicoOrcamento;

      this.orcamentoService.detalhaServicoOrcamentoByUsuario(this.detalheServicoOrcamentoEntity)
      .then((detalheServicoOrcamentoEntityResult: DetalheServicoOrcamentoEntity) => {
        this.detalheServicoOrcamentoEntity = detalheServicoOrcamentoEntityResult;

        console.log(this.detalheServicoOrcamentoEntity);

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

  escolherCotacaoConfirm(fab: FabContainer) {
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
            // this.escolherCotacao(fab);
          }
        }
      ]
    });
    confirm.present();
  }

  // escolherCotacao(fab) {
  //   fab.close();
  //   this.detalheCotacaoEntity.idCotacao = this.idCotacao;

  //   this.loading = this.loadingCtrl.create({
  //     content: 'Aguarde...'
  //   });
  //   this.loading.present();

  //   this.orcamentoService.escolherCotacao(this.detalheCotacaoEntity)
  //     .then((detalheCotacaoEntityResult: DetalheCotacaoEntity) => {
  //       this.loading.dismiss();
  //       this.presentToast();
  //       setTimeout(() => {
  //       this.navCtrl.setRoot(HomePage);
  //       }, 3000);
  //     }, (err) => {
  //       this.loading.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });
  // }

  // modalAvaliacao(fab: FabContainer) {
  //   if(fab) {
  //     fab.close();
  //   }
  //   let modal = this.modalCtrl.create(AvaliacaoFornecedorPage, {idOrdemServico: this.detalheCotacaoEntity.idOrdemServico});
  //   modal.present();
  // }

  // modalImagensFornecedor(fab: FabContainer) {
  //   fab.close();
  //   let modal = this.modalCtrl.create(ModalImagemFornecedorPage, {idFornecedor: this.idFornecedor});
  //   modal.present();
  // }

}

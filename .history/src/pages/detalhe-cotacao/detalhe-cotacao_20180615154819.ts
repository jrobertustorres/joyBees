import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, FabContainer } from 'ionic-angular';

//ENTITYS
import { CotacaoEntity } from '../../model/cotacao-entity';
import { DetalheOrcamentoEntity } from './../../model/detalhe-orcamento-entity';

//SERVICES
import { OrcamentoService } from '../../providers/orcamento-service';

//PAGES
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-detalhe-cotacao',
  templateUrl: 'detalhe-cotacao.html',
})
export class DetalheCotacaoPage {
  private cotacaoEntity: CotacaoEntity;
  private detalheOrcamentoEntity: DetalheOrcamentoEntity;
  public idOrcamento: number;
  public idFornecedor: number;
  private loading = null;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private orcamentoService: OrcamentoService,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.cotacaoEntity = new CotacaoEntity();
    this.detalheOrcamentoEntity = new DetalheOrcamentoEntity();
    this.idOrcamento = navParams.get('idOrcamento');
  }

  ngOnInit() {
    this.detalheCotacao();
  }

  ionViewDidLoad() {
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Orçamento escolhido',
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
        content: 'Aguarde...',
        // dismissOnPageChange: true
      });
      this.loading.present();

      this.detalheOrcamentoEntity = new DetalheOrcamentoEntity();
      this.detalheOrcamentoEntity.idOrcamento = this.idOrcamento;

      this.orcamentoService.detalhaOrcamentoByUsuario(this.detalheOrcamentoEntity)
      .then((detalheCotacaoEntityResult: DetalheOrcamentoEntity) => {
        this.detalheOrcamentoEntity = detalheCotacaoEntityResult;
        // this.idFornecedor = this.detalheOrcamentoEntity.idFornecedor;

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
      title: 'Escolha de orçamento',
      message: 'Você escolheu este orçamento. Podemos confirmar sua escolha?',
      buttons: [
        {
          text: 'CANCELAR',
          handler: () => {
          }
        },
        {
          text: 'CONFIRMAR!',
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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';

//SERVICES
import { OrcamentoService } from './../../providers/orcamento-service';

//ENTITYS
// import { OrdemServicoEntity } from '../../model/orderm-servico-entity';
import { AvaliaCotacaoEntity } from '../../model/avalia-cotacao-entity';

//PAGES
// import { OrcamentosListPage } from '../orcamentos-list/orcamentos-list';

@IonicPage()
@Component({
  selector: 'page-modal-avaliacao-servico-fornecedor',
  templateUrl: 'modal-avaliacao-servico-fornecedor.html',
})
export class ModalAvaliacaoServicoFornecedorPage {
  public idCotacao: number;
  private loading = null;
  private avaliaCotacaoEntity: AvaliaCotacaoEntity;

  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController,
              private orcamentoService: OrcamentoService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public navParams: NavParams) {
    this.idCotacao = navParams.get('idCotacao');
    this.avaliaCotacaoEntity = new AvaliaCotacaoEntity();
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Obrigado por sua avaliação!',
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  enviarAvaliacao(avaliacao) {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.avaliaCotacaoEntity.idCotacao = this.idCotacao;
      this.avaliaCotacaoEntity.avaliacao = avaliacao;

      this.orcamentoService
      .avaliaCotacao(this.avaliaCotacaoEntity)
      .then((avaliaCotacaoEntityResult: AvaliaCotacaoEntity) => {
        this.loading.dismiss();
        this.presentToast();
        setTimeout(() => {
          // this.navCtrl.setRoot(OrcamentosListPage);
        }, 3000);
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

}

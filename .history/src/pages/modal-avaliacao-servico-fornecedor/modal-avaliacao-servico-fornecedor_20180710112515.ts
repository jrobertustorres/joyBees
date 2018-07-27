import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';

//SERVICES
import { OrcamentoService } from './../../providers/orcamento-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
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
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public viewCtrl: ViewController,
              private orcamentoService: OrcamentoService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.idCotacao = navParams.get('idCotacao');
    this.avaliaCotacaoEntity = new AvaliaCotacaoEntity();
  }

  ngOnInit() {
    this.getTraducao();
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getTraducao() {
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
      message: this.languageDictionary.MSG_OBRIGADO_AVALIAR,
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

      console.log(avaliacao);

      if(avaliacao) {

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
      } else {
        this.alertAvaliacao();
      }
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }
  }

  alertAvaliacao() {
    const alert = this.alertCtrl.create({
      title: 'Avaliação!',
      subTitle: 'Antes de salvar é necesário selecionar alguma estrela!',
      buttons: ['OK']
    });
    alert.present();
  }

}

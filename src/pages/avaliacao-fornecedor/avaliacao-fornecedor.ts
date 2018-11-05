import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, ToastController } from 'ionic-angular';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { OrcamentoService } from '../../providers/orcamento-service';

//ENTITYS
import { AvaliaCotacaoEntity } from '../../model/avalia-cotacao-entity';

//PAGES
import { OrcamentoPrincipalPage } from '../orcamento-principal/orcamento-principal';

@IonicPage()
@Component({
  selector: 'page-avaliacao-fornecedor',
  templateUrl: 'avaliacao-fornecedor.html',
})
export class AvaliacaoFornecedorPage {
  public languageDictionary: any;
  public idCotacao: number;
  private loading = null;
  private avaliaCotacaoEntity: AvaliaCotacaoEntity;

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

  closeModal() {
    this.viewCtrl.dismiss();
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
      if(avaliacao) {
        this.loading = this.loadingCtrl.create({
          content: 'Aguarde...',
        });
        this.loading.present();

        this.avaliaCotacaoEntity.idCotacao = this.idCotacao;
        this.avaliaCotacaoEntity.avaliacao = avaliacao;

        this.orcamentoService
        .avaliacaoFornecedor(this.avaliaCotacaoEntity)
        .then((avaliaCotacaoEntityResult: AvaliaCotacaoEntity) => {
          this.loading.dismiss();
          this.presentToast();
          
          setTimeout(() => {
            this.closeModal();
            //this.navCtrl.setRoot(OrcamentoPrincipalPage);
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
      title: this.languageDictionary.LABEL_AVALIE_SERVICO,
      subTitle: this.languageDictionary.SUBTITLE_AVALIACAO,
      buttons: ['OK']
    });
    alert.present();
  }

}

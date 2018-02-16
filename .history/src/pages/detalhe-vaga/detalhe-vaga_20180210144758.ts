import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-detalhe-vaga',
  templateUrl: 'detalhe-vaga.html',
})
export class DetalheVagaPage {
  public idVaga: number;
  private loading: any;
  private loadingText: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    this.idVaga = navParams.get('idVaga');
  }

  ngOnInit() {
    this.callDetalheVaga();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalheVagaPage');
  }

  callDetalheVaga() {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaDetalheEntity = new CotacaoDetalheEntity();
  
      this.detalhesOrcamentoService.findFornecedorTipoServicoDetalheByIdUsuarioTipoServico(this.cotacaoEntity)
        .then((fornecedorDetalheEntityResult: CotacaoDetalheEntity) => {
          this.orcamentoDetalheResult = fornecedorDetalheEntityResult;
          console.log(this.orcamentoDetalheResult);
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

}

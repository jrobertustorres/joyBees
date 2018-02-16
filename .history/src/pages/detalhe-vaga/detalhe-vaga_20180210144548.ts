import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-detalhe-vaga',
  templateUrl: 'detalhe-vaga.html',
})
export class DetalheVagaPage {
  public idVaga: number;
  private loading: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
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

      console.log(localStorage.getItem(Constants.TIPO_USUARIO_SELECIONADO));

      if (localStorage.getItem(Constants.TIPO_USUARIO_SELECIONADO) == null || 
          localStorage.getItem(Constants.TIPO_USUARIO_SELECIONADO) == 'fornecedor') {
        this.orcamentoDetalheResult = new CotacaoDetalheEntity();

        console.log(this.orcamentoDetalheResult);
        this.callDetalheOrcamentoFornecedor();
      } else {

        // this.orcamentoDetalheResult = new UsuarioTipoServicoDetalheEntity();
        // this.callDetalheOrcamentoCliente();
        this.orcamentoDetalheResult = new UsuarioTipoServicoDetalheEntity();

        if (this.statusOrcamento == 'Pendente' || this.statusOrcamento == 'Pending') {
          this.callDetalheOrcamentoClientePendente();
        } 
        else {
        // this.orcamentoDetalheResult = new UsuarioTipoServicoDetalheEntity();
        this.callDetalheOrcamentoCliente();
        }
      }

    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }

  }

}

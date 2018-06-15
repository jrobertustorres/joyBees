import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//SERVICES
import { ServicoService } from './../../providers/servico-service';

//ENTITYS
import { ServicoListEntity } from '../../model/servico-list-entity';

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
  private listServicoRespostaChild: any;

  // listServicoResposta: Array<ServicoMapEntity[]>;
  // listServicoResposta : Map<string, ServicoMapEntity[]>

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
    this.servicoListEntity = new ServicoListEntity();
  }

  ngOnInit() {
    this.getMapServico();
  }

  ionViewDidLoad() {
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
        content: 'Aguarde...'
      });
      this.loading.present();
      this.servicoService.findMapServico(this.servicoListEntity)
        .then((servicoListEntityResult: ServicoListEntity) => {
          this.listaServicos = servicoListEntityResult;
          this.servicoListEntity.limitDados = this.listaServicos.length;

          // this.listServicoResposta = this.listaServicos.listServicos;

          // for (let value of this.listaServicos) {
          //   console.log(value);
          // }

          // console.log(this.listaServicos);


          // this.listServicoResposta = this.listaServicos.listServicoCotacaoFornecedorEntity;

          this.listServicoResposta = servicoListEntityResult;

          
          // for (let i=0; i < this.listaServicos.length; i++) {
          //   console.log(this.listServicoResposta[i].listServicos);
            // this.listServicoRespostaChild[i].push(this.listServicoResposta[i].listServicos);
          // }



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
    // console.log(i);
    console.log(this.listServicoResposta[i].listServicos);

    // let listServicoRespostaChild = this.listServicoResposta[i].listServicos;
    this.listServicoRespostaChild = this.listServicoResposta[i].listServicos;
    // this.listServicoRespostaChild = listServicoRespostaChild;
    this.listServicoResposta[i].open = !this.listServicoResposta[i].open;
  }

}

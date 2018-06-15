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
  private servicosSelecionados: any[] = [];
  private auxIndex = null;

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

          this.listServicoResposta = servicoListEntityResult;
          
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
  }

  servicosChecked(idServico) {
    console.log(this.servicosSelecionados.indexOf(idServico, 0));
    // this.servicosSelecionados.pop(idServico)
    this.servicosSelecionados.push(idServico);
    console.log(this.servicosSelecionados);
    //   if (this.listIdFornecedor.indexOf(fornecedor) == -1) {
    //     this.listIdFornecedor.push(fornecedor);
    //     this.contador = this.contador +1;
    //   }else{
    //     this.listIdFornecedor.splice(this.listIdFornecedor.indexOf( fornecedor),1);
    //     this.contador = this.contador == 0 ? this.contador : this.contador-1;
    //   }
    // this.showAlert();
  }

  verificaServicosSelecionados() {

  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Falha ao lançar!',
      subTitle: 'Por favor, selecione algum serviço!',
      buttons: ['OK']
    });
    alert.present();
  }

}

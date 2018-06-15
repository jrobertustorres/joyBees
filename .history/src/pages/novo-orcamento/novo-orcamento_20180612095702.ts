import { Component, Type } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//SERVICES
import { ServicoService } from './../../providers/servico-service';

//ENTITYS
import { ServicoMapEntity } from '../../model/servico-map-entity';

@IonicPage()
@Component({
  selector: 'page-novo-orcamento',
  templateUrl: 'novo-orcamento.html',
})
export class NovoOrcamentoPage {
  public loading = null;
  private servicoMapEntity: ServicoMapEntity;
  private listServicos: any;
  private listServicoResposta = [];

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
    this.servicoMapEntity = new ServicoMapEntity();
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
      this.servicoMapEntity.limitDados = this.servicoMapEntity.limitDados ? this.listServicos.length : null;

      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();
      this.servicoService.findMapServico(this.servicoMapEntity)
        .then((servicoMapEntityResult: ServicoMapEntity) => {
          this.listServicos = servicoMapEntityResult;
          this.servicoMapEntity.limitDados = this.listServicos.length;
          console.log(typeof this.listServicoResposta);

          this.listServicoResposta = this.listServicos.mapServicos;
          // for (let key of map.keys()) {
          //   console.log(key);
          // }
          // let listServicoResposta = this.listServicos.mapServicos;
          // for (let listServicoResposta of this.listServicos.mapServicos) {
          //   console.log(listServicoResposta);
          //   this.listServicoResposta = listServicoResposta;
          // }
          // for (let value of listServicoResposta.values()) {
          //   console.log(value);
          // }
          console.log(this.listServicoResposta);
          

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
    this.listServicoResposta[i].open = !this.listServicoResposta[i].open;
  }

}

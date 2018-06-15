import { Component } from '@angular/core';
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
  private mapServicos: any;
  // public mapServicos : Map<string, ServicoEntity[]>

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
    this.servicoMapEntity = new ServicoMapEntity();
  }

  ngOnInit() {
    this.getTipoServicoGrupo();
  }

  ionViewDidLoad() {
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.getTipoServicoGrupo();
      infiniteScroll.complete();
    }, 500);
  }

  getTipoServicoGrupo() {
    try {
      this.servicoMapEntity.limitDados = this.servicoMapEntity.limitDados ? this.mapServicos.length : null;

      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();
      // let mapServicos : Map<string, ServicoEntity[]>;

      // this.servicoMapEntity.limitDados = limitDados;
      this.servicoService.findMapServico(this.servicoMapEntity)
        .then((servicoMapEntityResult: ServicoMapEntity) => {
          this.mapServicos = servicoMapEntityResult;
          this.servicoMapEntity.limitDados = this.mapServicos.length;

          console.log(this.mapServicos);

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

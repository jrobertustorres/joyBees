import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

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
  // public mapServicos : Map<string, ServicoEntity[]>

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public navParams: NavParams) {
    this.servicoMapEntity = new ServicoMapEntity();
  }

  ngOnInit() {
    this.getTipoServicoGrupo();
  }

  ionViewDidLoad() {
  }

  getTipoServicoGrupo() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.servicoService.findMapServicosAtivos(limiteDados)
        .then((tipoServicoGrupoTipoServicoEntityListResult: TipoServicoGrupoTipoServicoEntity[]) => {
          this.tipoServicoGrupoTipoServicoEntityList = tipoServicoGrupoTipoServicoEntityListResult;
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

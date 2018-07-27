import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { OrcamentoService } from './../../providers/orcamento-service';

//ENTITYS
import { CockpitCotacaoEntity } from '../../model/cockpit-cotacao-entity';

//PAGES
import { NovoOrcamentoPage } from './../novo-orcamento/novo-orcamento';
import { OrcamentosListByStatusPage } from '../orcamentos-list-by-status/orcamentos-list-by-status';

@IonicPage()
@Component({
  selector: 'page-orcamento-principal',
  templateUrl: 'orcamento-principal.html',
})
export class OrcamentoPrincipalPage {
  private cockpitCotacaoEntity: CockpitCotacaoEntity;
  private loading = null;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private orcamentoService: OrcamentoService,
              public navParams: NavParams) {
    this.cockpitCotacaoEntity = new CockpitCotacaoEntity();
  }

  ngOnInit() {
    this.getCockpitCotacaoByUsuario();
  }

  ionViewDidLoad() {
  }

  doRefresh(refresher) {
    this.getCockpitCotacaoByUsuario();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  getCockpitCotacaoByUsuario() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.orcamentoService.findCockpitCotacaoByUsuario()
      .then((cockpitCotacaoServiceResult: CockpitCotacaoEntity) => {
        this.cockpitCotacaoEntity = cockpitCotacaoServiceResult;

        console.log(this.cockpitCotacaoEntity);

        this.loading.dismiss();
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

  openCotacoesList(status) {
    this.navCtrl.push(OrcamentosListByStatusPage, {status: status});
  }

  novoOrcamento() {
    this.navCtrl.push(NovoOrcamentoPage);
  }

}

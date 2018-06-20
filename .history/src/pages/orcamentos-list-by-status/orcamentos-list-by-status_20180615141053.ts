import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//ENTITYS
import { OrcamentoEntity } from './../../model/orcamento-entity';

//SERVICES
import { CotacaoService } from './../../providers/cotacao-service';

@IonicPage()
@Component({
  selector: 'page-orcamentos-list-by-status',
  templateUrl: 'orcamentos-list-by-status.html',
})
export class OrcamentosListByStatusPage {
  public status: string;
  private orcamentoEntity: OrcamentoEntity;
  private cotacoesList: any;
  public loading = null;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private cotacaoService: CotacaoService,
              public navParams: NavParams) {
    this.status = navParams.get("status");
    this.orcamentoEntity = new OrcamentoEntity();
  }

  ngOnInit() {
    this.findCotacoesListByStatus();
  }

  ionViewDidLoad() {
  }

  findCotacoesListByStatus() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();

      this.orcamentoEntity.statusCotacaoEnum = this.status;
      this.cotacaoService.findOrcamentoByStatus(this.orcamentoEntity)
      .then((orcamentoServiceResult: OrcamentoEntity) => {
        this.cotacoesList = orcamentoServiceResult;

        console.log(this.cotacoesList);

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

}

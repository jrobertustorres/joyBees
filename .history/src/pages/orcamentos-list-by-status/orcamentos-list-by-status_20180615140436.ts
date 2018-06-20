import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//ENTITYS
import { CotacaoEntity } from './../../model/cotacao-entity';

//SERVICES
import { CotacaoService } from './../../providers/cotacao-service';

@IonicPage()
@Component({
  selector: 'page-orcamentos-list-by-status',
  templateUrl: 'orcamentos-list-by-status.html',
})
export class OrcamentosListByStatusPage {
  public status: string;
  private cotacaoEntity: CotacaoEntity;
  private cotacoesList: any;
  public loading = null;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private cotacaoService: CotacaoService,
              public navParams: NavParams) {
    this.status = navParams.get("status");
    this.cotacaoEntity = new CotacaoEntity();
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

      this.cotacaoEntity.statusCotacaoEnum = this.status;
      this.cotacaoService.findCotacaoFornecedorByStatus(this.cotacaoEntity)
      .then((cotacaoServiceResult: CotacaoEntity) => {
        this.cotacoesList = cotacaoServiceResult;

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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { DetalhesVagaService } from '../../providers/detalhe-vaga-service';

//ENTITY
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';


@IonicPage()
@Component({
  selector: 'page-detalhe-vaga',
  templateUrl: 'detalhe-vaga.html',
})
export class DetalheVagaPage {
  public idVaga: number;
  private loading: any;
  private loadingText: string;
  private vagaDetalheEntity: VagaDetalheEntity;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private detalhesVagaService: DetalhesVagaService) {

    this.vagaDetalheEntity = new VagaDetalheEntity();
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

      this.vagaDetalheEntity = new VagaDetalheEntity();
      this.vagaDetalheEntity.idVaga = this.idVaga;
   
      this.detalhesVagaService.findVagaDetalhe(this.vagaDetalheEntity)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          // this.orcamentoDetalheResult = fornecedorDetalheEntityResult;
          console.log(vagaDetalheEntityResult);
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

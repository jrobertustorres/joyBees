import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { DetalhesVagaService } from '../../providers/detalhe-vaga-service';


@IonicPage()
@Component({
  selector: 'page-detalhe-vaga',
  templateUrl: 'detalhe-vaga.html',
})
export class DetalheVagaPage {
  public idVaga: number;
  private loading: any;
  private loadingText: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private detalhesVagaService: DetalhesVagaService) {

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
  
      this.detalhesVagaService.findVagaDetalhe(this.idVaga)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.orcamentoDetalheResult = fornecedorDetalheEntityResult;
          console.log(this.orcamentoDetalheResult);
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

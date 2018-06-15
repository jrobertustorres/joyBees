import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

@IonicPage()
@Component({
  selector: 'page-vagas-em-destaque',
  templateUrl: 'vagas-em-destaque.html',
})
export class VagasEmDestaquePage {
  public loading = null;
  private vagas;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private vagaService: VagaService,
              public navParams: NavParams) {
  }

  ngOnInit() {
    // this.getLanguage();
    this.getVagasDestaque();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VagasEmDestaquePage');
  }

  getVagasDestaque() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaService.getVagasHome()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
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

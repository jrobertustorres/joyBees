import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { VagaService } from './../../providers/vaga-service';

//ENTITY
import { VagaListaEntity } from '../../model/vaga-lista-entity';


@IonicPage()
@Component({
  selector: 'page-vagas-candidatadas',
  templateUrl: 'vagas-candidatadas.html',
})
export class VagasCandidatadasPage {
  private loading: any;
  private loadingText: string;
  private vagaListaEntity: VagaListaEntity;
  private messagePresentToast: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    this.vagaListaEntity = new VagaListaEntity();
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    // this.getLanguage();
    this.callVagasCandidatadas();
  }

  callVagasCandidatadas() {
    try {
      
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      this.vagaListaEntity = new VagaListaEntity();
      // this.vagaDetalheEntity.idVaga = this.idVaga;
   
      this.vagaService.findVagaDetalhe(this.vagaListaEntity)
        .then((vagaDetalheEntityResult: VagaDetalheEntity) => {
          this.vagaDetalheEntity = vagaDetalheEntityResult;
          console.log(this.vagaDetalheEntity);
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

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.messagePresentToast = 'Parabéns! Você está candidatado à esta vaga!';
      this.loadingText = 'Aguarde...';
    } else {
      this.messagePresentToast = 'Congratulations! You are applying for this vacancy!';
      this.loadingText = 'Wait...';
    }
  }

}

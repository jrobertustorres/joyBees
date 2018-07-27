import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

// SERVICES
import { EstadosService } from '../../providers/estados-service';

@IonicPage()
@Component({
  selector: 'page-popover-principal',
  templateUrl: 'popover-principal.html',
})
export class PopoverPrincipalPage {
  private estados = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private estadosService: EstadosService,
              public viewCtrl: ViewController) {

      this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ionViewDidLoad() {
  }

  getCidadesByEstadoPopOver(idEstado) {
    try {
      if (this.selectedLanguage == 'pt-br') {
        this.messagePresentToast = 'Cadastro atualizado!';
        this.loadingCidades = 'Buscando cidades...';
      } else {
        this.messagePresentToast = 'Updated registration!';
        this.loadingCidades = 'Searching cities...';
      }
      this.loadingCidades = this.loadingCtrl.create({
        content: this.loadingCidades
      });
      this.loadingCidades.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;
          this.loadingCidades.dismiss();
        })
        .catch(err => {
          this.loadingCidades.dismiss();
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

  // close() {
  //   this.viewCtrl.dismiss();
  // }

}

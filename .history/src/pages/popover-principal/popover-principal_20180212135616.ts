import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

// SERVICES
import { EstadosService } from '../../providers/estados-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-popover-principal',
  templateUrl: 'popover-principal.html',
})
export class PopoverPrincipalPage {
  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private estados = [];
  private loading: any;
  private loadingText: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              private estadosService: EstadosService,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController) {

      this.translate = translate;
      this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
      this.translate.use(this.selectedLanguage);

      this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ngOnInit() {
    this.getLanguage();
  }

  ionViewDidLoad() {
  }

  getCidadesByEstadoPopOver(idEstado) {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();
      // if (this.selectedLanguage == 'pt-br') {
      //   this.messagePresentToast = 'Cadastro atualizado!';
      //   this.loadingCidades = 'Buscando cidades...';
      // } else {
      //   this.messagePresentToast = 'Updated registration!';
      //   this.loadingCidades = 'Searching cities...';
      // }
      // this.loadingCidades = this.loadingCtrl.create({
      //   content: this.loadingCidades
      // });
      // this.loadingCidades.present();

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

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.loadingText = 'Aguarde...';
    } else {
      this.loadingText = 'Wait...';
    }
  }

  // close() {
  //   this.viewCtrl.dismiss();
  // }

}

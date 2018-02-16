import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { HomeService } from '../../providers/home-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {

  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private vagas;
  private loadingText: string;
  private loading = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              private homeService: HomeService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage); 

    console.log(this.selectedLanguage);
  }

  ngOnInit() {
    // this.getLanguage();
    this.getVagasPrincipal();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrincipalPage');
  }

  getVagasPrincipal() {
    try {

      this.homeService.getVagasHome()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          console.log(vagasListaEntityResult);
          // this.vagas = vagasListaEntityResult;
          // this.statusOrcamentoCockpit = cockpitUsuarioTipoServicoEntityResult;
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

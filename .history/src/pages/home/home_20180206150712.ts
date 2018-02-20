import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//PAGES
import { LoginPage } from '../login/login';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { ModalTermosPage } from '../modal-termos/modal-termos';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { HomeService } from '../../providers/home-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  segment: string = "vagasDestaque"; // default button

  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu : MenuController,
              translate: TranslateService,
              private homeService: HomeService,
              public modalCtrl: ModalController) {

    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage); 

  }

  ngOnInit() {
    this.getVagasHome();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on this page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menu.enable(true);
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
    // this.navCtrl.setRoot(PrincipalPage);
  }

  goMeusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  getVagasHome() {
    try {

      this.homeService.getDadosCockpitHome()
        .then((cockpitUsuarioTipoServicoEntityResult: CockpitUsuarioTipoServicoEntity) => {
          this.statusOrcamentoCockpit = cockpitUsuarioTipoServicoEntityResult;
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
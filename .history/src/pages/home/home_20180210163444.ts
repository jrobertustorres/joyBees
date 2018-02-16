import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//PAGES
import { LoginPage } from '../login/login';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { ModalTermosPage } from '../modal-termos/modal-termos';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { VagaListaEntity } from '../../model/vaga-lista-entity';

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
  private loadingText: string;
  private loading = null;
  private vagas;

  private titleNaoLogado: string;
  private subTitleNaoLogado: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private menu : MenuController,
              translate: TranslateService,
              private vagaService: VagaService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController) {

    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage); 

    if (this.selectedLanguage == 'pt-br') {
      this.loadingText = 'Procurando vagas...';
    } else {
      this.loadingText = 'Looking for vacancies...';
    }
    this.loading = this.loadingCtrl.create({
      content: this.loadingText
    });
    this.loading.present();

  }

  ngOnInit() {
    this.getLanguage();
    this.getVagasGeralHome();
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

  getVagasGeralHome() {
    try {

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

  candidatarVaga(idVaga) {
    console.log(idVaga);
    console.log(localStorage.getItem(Constants.ID_USUARIO));
    localStorage.setItem(Constants.ID_VAGA_CANDIDATAR, idVaga);

    if(!localStorage.getItem(Constants.ID_USUARIO)) {
      this.showAlertNaoLogado();
    }
  }

  showAlertNaoLogado() {
    let alert = this.alertCtrl.create({
      title: this.titleNaoLogado,
      subTitle: this.subTitleNaoLogado,
      buttons: ['OK']
    });
    alert.present();
  }

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.titleNaoLogado = 'Você não está logado!';
      this.subTitleNaoLogado = 'Para se candidatar a alguma vaga, é necessário fazer login!';
    } else {
      this.titleNaoLogado = 'You are not logged in!';
      this.subTitleNaoLogado = 'To apply for a job, you must login!';
    }
  }



}

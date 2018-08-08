import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { OrcamentoService } from './../../providers/orcamento-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { CotacaoOrcamentoUsuarioEntity } from '../../model/cotacao-orcamento-usuario-entity';

//PAGES
import { NovoOrcamentoPage } from './../novo-orcamento/novo-orcamento';
import { OrcamentosListByStatusPage } from '../orcamentos-list-by-status/orcamentos-list-by-status';

@IonicPage()
@Component({
  selector: 'page-orcamento-principal',
  templateUrl: 'orcamento-principal.html',
})
export class OrcamentoPrincipalPage {
  private cotacaoOrcamentoUsuarioEntity: CotacaoOrcamentoUsuarioEntity;
  private loading = null;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private orcamentoService: OrcamentoService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.cotacaoOrcamentoUsuarioEntity = new CotacaoOrcamentoUsuarioEntity();
  }

  ngOnInit() {
    this.getTraducao();
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getCockpitCotacaoByUsuario();
        
        this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  doRefresh(refresher) {
    this.getCockpitCotacaoByUsuario();

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  getCockpitCotacaoByUsuario() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.orcamentoService.findCockpitCotacaoByUsuario()
      .then((cockpitCotacaoServiceResult: CotacaoOrcamentoUsuarioEntity) => {
        this.cotacaoOrcamentoUsuarioEntity = cockpitCotacaoServiceResult;

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

  openCotacoesList(status) {
    this.navCtrl.push(OrcamentosListByStatusPage, {status: status});
  }

  novoOrcamento() {
    this.navCtrl.push(NovoOrcamentoPage);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { OrcamentoService } from './../../providers/orcamento-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { CotacaoEntity } from '../../model/cotacao-entity';

@IonicPage()
@Component({
  selector: 'page-cotacoes-respondidas-list',
  templateUrl: 'cotacoes-respondidas-list.html',
})
export class CotacoesRespondidasListPage {
  public idServicoOrcamento: number;
  public languageDictionary: any;
  public loading = null;
  private cotacaoEntity: CotacaoEntity;
  private cotacoesRespondidasList: any;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private orcamentoService: OrcamentoService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.idServicoOrcamento = navParams.get('idServicoOrcamento');
    this.cotacaoEntity = new CotacaoEntity();
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
        this.findCotacoesRespondidas();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  findCotacoesRespondidas() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.cotacaoEntity.idServicoOrcamento = this.idServicoOrcamento;
      this.orcamentoService.findCotacoesRespondidas(this.cotacaoEntity)
      .then((cotacaoResult: CotacaoEntity) => {
        this.cotacoesRespondidasList = cotacaoResult;

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

}

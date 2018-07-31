import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { OrcamentoService } from './../../providers/orcamento-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { CotacaoEntity } from '../../model/cotacao-entity';

//PAGES
import { DetalheCotacaoPage } from '../detalhe-cotacao/detalhe-cotacao';

@IonicPage()
@Component({
  selector: 'page-cotacoes-respondidas-list',
  templateUrl: 'cotacoes-respondidas-list.html',
})
export class CotacoesRespondidasListPage {
  public idServicoOrcamento: number;
  public idCotacao: number;
  public idOrcamento: number;
  public languageDictionary: any;
  public loading = null;
  private cotacaoEntity: CotacaoEntity;
  private cotacoesRespondidasList: any;
  private qtdFornecedorPendenteResposta: number;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private orcamentoService: OrcamentoService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.idServicoOrcamento = navParams.get('idServicoOrcamento');
    this.idCotacao = navParams.get('idCotacao');
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

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.findCotacoesRespondidas();
      infiniteScroll.complete();
    }, 500);
  }

  findCotacoesRespondidas() {
    try {

      this.cotacaoEntity.limiteDados = this.cotacaoEntity.limiteDados ? this.cotacoesRespondidasList.length : null;

      if(this.cotacaoEntity.limiteDados == null) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT
        });
        this.loading.present();
      }

      this.cotacaoEntity.idServicoOrcamento = this.idServicoOrcamento;
      this.orcamentoService.findCotacoesRespondidas(this.cotacaoEntity)
      .then((cotacaoResult: CotacaoEntity) => {
        this.cotacoesRespondidasList = cotacaoResult;
        this.cotacaoEntity.limiteDados = this.cotacoesRespondidasList.length;
        this.qtdFornecedorPendenteResposta = this.cotacoesRespondidasList[0].qtdFornecedorPendenteResposta;

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

  openDetalhaCotacao(idCotacao) {
    this.navCtrl.push(DetalheCotacaoPage, {idCotacao: idCotacao});
  }

}

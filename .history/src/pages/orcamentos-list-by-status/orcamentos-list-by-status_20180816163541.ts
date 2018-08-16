import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//ENTITYS
import { OrcamentoEntity } from './../../model/orcamento-entity';

//SERVICES
import { OrcamentoService } from './../../providers/orcamento-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//PAGES
import { CotacoesRespondidasListPage } from '../cotacoes-respondidas-list/cotacoes-respondidas-list';
import { DetalhaServicoOrcamentoByUsuarioPage } from '../detalha-servico-orcamento-by-usuario/detalha-servico-orcamento-by-usuario';
@IonicPage()
@Component({
  selector: 'page-orcamentos-list-by-status',
  templateUrl: 'orcamentos-list-by-status.html',
})
export class OrcamentosListByStatusPage {
  public status: string;
  private orcamentoEntity: OrcamentoEntity;
  private orcamentosList: any;
  public loading = null;
  public languageDictionary: any;
  private refresh: boolean = false;

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private orcamentoService: OrcamentoService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.status = navParams.get("status");
    this.orcamentoEntity = new OrcamentoEntity();
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
        this.findCotacoesListByStatus();
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

      this.findCotacoesListByStatus();
      infiniteScroll.complete();
    }, 500);
  }

  findCotacoesListByStatus() {
    try {
      this.orcamentoEntity.limitDados = this.orcamentoEntity.limitDados ? this.orcamentosList.length : null;

      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
        });
        this.loading.present();
      }

      this.orcamentoEntity.statusOrcamentoEnum = this.status;
      this.orcamentoService.findServicoOrcamentoByStatus(this.orcamentoEntity)
      .then((orcamentoServiceResult: OrcamentoEntity) => {
        this.orcamentosList = orcamentoServiceResult;
        this.orcamentoEntity.limitDados = this.orcamentosList.length;

        this.refresh = true;
        this.loading ? this.loading.dismiss() : '';
      }, (err) => {
        this.loading ? this.loading.dismiss() : '';
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

  findServicoOrcamentoByStatusFilter(filtro) {
    try {

      console.log(filtro);
      
      this.orcamentoEntity.limitDados = this.orcamentoEntity.limitDados ? this.orcamentosList.length : null;

      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
        });
        this.loading.present();
      }

      this.orcamentoEntity.statusOrcamentoEnum = this.status;
      this.orcamentoService.findServicoOrcamentoByStatusFilter(this.orcamentoEntity)
      .then((orcamentoServiceResult: OrcamentoEntity) => {
        this.orcamentosList = orcamentoServiceResult;
        this.orcamentoEntity.limitDados = this.orcamentosList.length;

        this.refresh = true;
        this.loading ? this.loading.dismiss() : '';
      }, (err) => {
        this.loading ? this.loading.dismiss() : '';
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

  verificaStatus(idServicoOrcamento) {
    if (this.status =='RESPONDIDO') {
      this.openCotacoesRespondidasList(idServicoOrcamento);
    } else {
      this.openDetalhaServicoOrcamentoByUsuario(idServicoOrcamento);
    }
  }

  openCotacoesRespondidasList(idServicoOrcamento) {
    this.navCtrl.push(CotacoesRespondidasListPage, {idServicoOrcamento: idServicoOrcamento});
  }

  openDetalhaServicoOrcamentoByUsuario(idServicoOrcamento) {
    this.navCtrl.push(DetalhaServicoOrcamentoByUsuarioPage, {idServicoOrcamento: idServicoOrcamento});
  }

}

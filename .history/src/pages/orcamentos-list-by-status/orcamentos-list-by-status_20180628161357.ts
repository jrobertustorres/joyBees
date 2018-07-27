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

  constructor(public navCtrl: NavController, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private orcamentoService: OrcamentoService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.status = navParams.get("status");
    this.orcamentoEntity = new OrcamentoEntity();
    console.log(this.status);
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

  findCotacoesListByStatus() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.orcamentoEntity.statusOrcamentoEnum = this.status;
      this.orcamentoService.findServicoOrcamentoByStatus(this.orcamentoEntity)
      .then((orcamentoServiceResult: OrcamentoEntity) => {
        this.orcamentosList = orcamentoServiceResult;

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

  verificaStatus(idServicoOrcamento, idOrcamento) {
    if (this.status =='RESPONDIDO') {
      this.openCotacoesRespondidasList(idServicoOrcamento);
    } else {
      this.openDetalhaServicoOrcamentoByUsuario(idOrcamento);
    }
  }

  openCotacoesRespondidasList(idServicoOrcamento) {
    this.navCtrl.push(CotacoesRespondidasListPage, {idServicoOrcamento: idServicoOrcamento});
  }

  openDetalhaServicoOrcamentoByUsuario(idServicoOrcamento) {
    this.navCtrl.push(DetalhaServicoOrcamentoByUsuarioPage, {idServicoOrcamento: idServicoOrcamento});
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { DetalheServicoOrcamentoEntity } from '../../model/detalhe-servico-orcamento-entity';
import { OrcamentoService } from '../../providers/orcamento-service';

@IonicPage()
@Component({
  selector: 'page-detalha-servico-orcamento-by-usuario',
  templateUrl: 'detalha-servico-orcamento-by-usuario.html',
})
export class DetalhaServicoOrcamentoByUsuarioPage {
  public languageDictionary: any;
  private loading = null;
  private idServicoOrcamento: number;
  private detalheServicoOrcamentoEntity: DetalheServicoOrcamentoEntity;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private orcamentoService: OrcamentoService,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.detalheServicoOrcamentoEntity = new DetalheServicoOrcamentoEntity();
    this.idServicoOrcamento = navParams.get('idServicoOrcamento');
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
        this.detalheCotacao();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  detalheCotacao() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.detalheServicoOrcamentoEntity.idServicoOrcamento = this.idServicoOrcamento;

      this.orcamentoService.detalhaCotacao(this.detalheServicoOrcamentoEntity)
      .then((detalheServicoOrcamentoEntityResult: DetalheServicoOrcamentoEntity) => {
        this.detalheServicoOrcamentoEntity = detalheServicoOrcamentoEntityResult;

        console.log(this.detalheServicoOrcamentoEntity);

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

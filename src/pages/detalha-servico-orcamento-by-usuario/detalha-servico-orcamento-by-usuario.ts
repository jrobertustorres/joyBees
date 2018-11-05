import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { DetalheServicoOrcamentoEntity } from '../../model/detalhe-servico-orcamento-entity';
import { OrcamentoService } from '../../providers/orcamento-service';

//PAGES
import { AvaliacaoFornecedorPage } from './../avaliacao-fornecedor/avaliacao-fornecedor';
import { ModalImagemFornecedorPage } from '../modal-imagem-fornecedor/modal-imagem-fornecedor';
import { OrcamentoPrincipalPage } from '../orcamento-principal/orcamento-principal';

@IonicPage()
@Component({
  selector: 'page-detalha-servico-orcamento-by-usuario',
  templateUrl: 'detalha-servico-orcamento-by-usuario.html',
})
export class DetalhaServicoOrcamentoByUsuarioPage {
  public languageDictionary: any;
  private loading = null;
  private idServicoOrcamento: number;
  private idFornecedor: number;
  private idCotacao: number;
  private detalheServicoOrcamentoEntity: DetalheServicoOrcamentoEntity;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private orcamentoService: OrcamentoService,
              public modalCtrl: ModalController,
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
        this.detalheServicoOrcamento();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  detalheServicoOrcamento() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.detalheServicoOrcamentoEntity.idServicoOrcamento = this.idServicoOrcamento;

      this.orcamentoService.detalhaServicoOrcamentoByUsuario(this.detalheServicoOrcamentoEntity)
      .then((detalheServicoOrcamentoEntityResult: DetalheServicoOrcamentoEntity) => {
        this.detalheServicoOrcamentoEntity = detalheServicoOrcamentoEntityResult;
        this.idFornecedor = this.detalheServicoOrcamentoEntity.idFornecedor;
        this.idCotacao = this.detalheServicoOrcamentoEntity.idCotacao;

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

  modalAvaliacao() {
    let modal = this.modalCtrl.create(AvaliacaoFornecedorPage, {idCotacao: this.detalheServicoOrcamentoEntity.idCotacao});
    modal.onDidDismiss((data) => {
      this.navCtrl.setRoot(OrcamentoPrincipalPage);
    });

    modal.present();
  }

  modalImagensFornecedor() {
    let modal = this.modalCtrl.create(ModalImagemFornecedorPage, {idFornecedor: this.idFornecedor});
    modal.present();
  }

}

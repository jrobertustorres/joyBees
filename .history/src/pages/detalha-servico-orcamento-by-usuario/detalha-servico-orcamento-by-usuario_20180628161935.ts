import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';

@IonicPage()
@Component({
  selector: 'page-detalha-servico-orcamento-by-usuario',
  templateUrl: 'detalha-servico-orcamento-by-usuario.html',
})
export class DetalhaServicoOrcamentoByUsuarioPage {,
  public languageDictionary: any;

  constructor(public navCtrl: NavController,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
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

      this.detalheCotacaoEntity.idCotacao = this.idCotacao;

      this.orcamentoService.detalhaCotacao(this.detalheCotacaoEntity)
      .then((detalheServicoOrcamentoEntityResult: DetalheCotacaoEntity) => {
        this.detalheCotacaoEntity = detalheServicoOrcamentoEntityResult;

        console.log(this.detalheCotacaoEntity);

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

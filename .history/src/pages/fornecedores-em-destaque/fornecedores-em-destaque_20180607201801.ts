import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../app/constants';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//PAGES
import { HomePage } from './../home/home';

@IonicPage()
@Component({
  selector: 'page-fornecedores-em-destaque',
  templateUrl: 'fornecedores-em-destaque.html',
})
export class FornecedoresEmDestaquePage {
  public loading = null;
  private fornecedores;
  private loadingText: string;

  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private _idioma: string;

  private titleNaoLogado: string;
  private subTitleNaoLogado: string;

  constructor(public navCtrl: NavController, 
              translate: TranslateService,
              public navParams: NavParams) {
    this.translate = translate;
  }

  ngOnInit() {
    this.getLanguage();
    let fornecedores = [{idFornecedor: "1", nome:"Tipo de serviço 01", 
                  descricao:"Concertar máquinas com defeito", 
                  cidadeEstadoFormat:"Tsuchima - Aichi", 
                  tempoAberto: "10 dias"},
                  {idFornecedor: "2", nome:"Tipo de serviço 02", 
                  descricao:"Dirigir empilhadeira", 
                  cidadeEstadoFormat:"Tsuchima - Aichi", 
                  tempoAberto: "10 dias"}
                ];
    this.fornecedores = fornecedores;
    console.log(fornecedores);
    // this.getVagasDestaque();
  }

  ionViewDidLoad() {
  }

  getIdFornecedor(idFornecedor) {
    // quando clicar no item da lista pegar o id do tipo de serviço e depois de logar já cair na tela de lista de serviços
    //daquele id
    console.log(idFornecedor);
  }

  openLoginPage() {
    this.navCtrl.push(HomePage, {loginPage: true});
  }

  getLanguage() {
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);

    if(!this.selectedLanguage){
      this.selectedLanguage = this._idioma;
    }
    if(this.selectedLanguage) {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingText = 'Procurando vagas...';
        this.titleNaoLogado = 'Você não está logado!';
        this.subTitleNaoLogado = 'Para se candidatar a alguma vaga, é necessário fazer login!';
      } else {
        this.loadingText = 'Looking for vacancies...';
        this.titleNaoLogado = 'You are not logged in!';
        this.subTitleNaoLogado = 'To apply for a job, you must login!';
      }
    }
    this.translate.use(this.selectedLanguage);
    // this.getVagasDestaque();
  }

}

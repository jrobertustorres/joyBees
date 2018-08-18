import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//SERVICES
import { VagaService } from '../../providers/vaga-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITY
import { VagaListaEntity } from '../../model/vaga-lista-entity';

//PAGES
import { DetalheVagaPage } from '../detalhe-vaga/detalhe-vaga';


@IonicPage()
@Component({
  selector: 'page-vagas-candidatadas',
  templateUrl: 'vagas-candidatadas.html',
})
export class VagasCandidatadasPage {
  public languageDictionary: any;

  private loading: any;
  private vagaListaEntity: VagaListaEntity;
  private vagas;
  private refresh: boolean = false;
  private nomeVaga: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private vagaService: VagaService,
              private languageTranslateService: LanguageTranslateService,
              public loadingCtrl: LoadingController) {

    this.vagaListaEntity = new VagaListaEntity();
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
        this.getVagasCandidatadas();
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

      if(this.vagaListaEntity.nome == '' || this.vagaListaEntity.nome == undefined) {
        this.getVagasCandidatadas();
      } else {
        this.filtrarPorNomeVaga(this.vagaListaEntity.nome);
      }
      infiniteScroll.complete();
    }, 500);
  }

  onCancelFilter() {
    this.refresh = false;
    this.getVagasCandidatadas();
  }

  onInputFilter(filtro) {
    this.refresh = false;
    if(filtro.srcElement.value == '') {
      this.getVagasCandidatadas();
    }
  }

  getVagasCandidatadas() {
    try {
      this.vagaListaEntity.nome = '';
      this.vagaListaEntity.limiteDados = this.vagaListaEntity.limiteDados ? this.vagas.length : null;

      if(this.refresh == false) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
        });
        this.loading.present();
      }

      this.vagaService.findVagasCandidatadas()
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          // this.vagas.limiteDados = this.vagas.length;
          this.vagaListaEntity.limiteDados = this.vagas.length;

          this.refresh = true;
          this.loading ? this.loading.dismiss() : '';
      }, (err) => {
        this.loading ? this.loading.dismiss() : '';
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

  filtrarPorNomeVaga(filtro) {
    try {
      this.vagaListaEntity.limiteDados = this.vagaListaEntity.limiteDados ? this.vagas.length : null;

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      console.log(filtro.srcElement.value);

      this.nomeVaga = filtro.srcElement.value;
      this.vagaService.findVagaCandidatarByVagaUsuarioFilter(this.nomeVaga)
        .then((vagasListaEntityResult: VagaListaEntity) => {
          this.vagas = vagasListaEntityResult;
          // this.vagas.limiteDados = this.vagas.length;
          this.vagaListaEntity.limiteDados = this.vagas.length;

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

  detalheVagaCandidatada(idVaga) {
    this.navCtrl.push(DetalheVagaPage, {
      idVaga: idVaga,
      candidatado: true
    })
  }

}

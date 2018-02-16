import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-modal-filtro',
  templateUrl: 'modal-filtro.html',
})
export class ModalFiltroPage {

  public filtroForm: FormGroup;
  languages = availableLanguages;
  selectedLanguage = null;
  private translate: TranslateService;
  private estados = [];
  private cidades = [];
  // private loading: any;
  private loadingText: string;
  private loadingCidades = null;
  private usuarioDetalheEntity: UsuarioDetalheEntity;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              translate: TranslateService,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              private vagaService: VagaService,
              public viewCtrl: ViewController) {

      this.translate = translate;
      this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
      this.translate.use(this.selectedLanguage);

      this.usuarioDetalheEntity = new UsuarioDetalheEntity();

      this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ngOnInit() {
    this.getLanguage();
    this.filtroForm = this.formBuilder.group({
      'grauEntendimento': [''],
      'grauFala': [''],
      'grauEscrita': [''],
      'idEstado': ['', Validators.required],
      'idCidade': ['', Validators.required],
    });
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getCidadesByEstadoPopOver(idEstado) {
    try {

      this.loadingCidades = this.loadingCtrl.create({
        content: this.loadingCidades
      });
      this.loadingCidades.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;
          this.loadingCidades.dismiss();
        })
        .catch(err => {
          this.loadingCidades.dismiss();
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

  submeterFiltro() {
    console.log(this.filtroForm.value);
    console.log('aqui');
    this.viewCtrl.dismiss({
      filter: this.usuarioDetalheEntity
    })
    if (this.filtroForm.valid) {
      
    //   this.vagaService.getVagasPrincipal()
    //   .then((vagasListaEntityResult: VagaListaEntity) => {
    //     this.vagas = vagasListaEntityResult;
    //     this.loading.dismiss();
    // }, (err) => {
    //   this.loading.dismiss();
    //   this.alertCtrl.create({
    //     subTitle: err.message,
    //     buttons: ['OK']
    //   }).present();
    // });
    
      // this.getVagasPrincipalFiltro();
    } else {
      Object.keys(this.filtroForm.controls).forEach(campo => {
        const controle = this.filtroForm.get(campo);
        controle.markAsTouched();
      })
    }
  }

  // getVagasPrincipalFiltro() {
  //   try {

  //     this.vagaService.getVagasPrincipal()
  //       .then((vagasListaEntityResult: VagaListaEntity) => {
  //         this.vagas = vagasListaEntityResult;
  //         // this.qtdVagas = this.vagas.length;
  //         // console.log(this.qtdVagas);
  //         this.loading.dismiss();
  //     }, (err) => {
  //       this.loading.dismiss();
  //       this.alertCtrl.create({
  //         subTitle: err.message,
  //         buttons: ['OK']
  //       }).present();
  //     });
  //   }
  //   catch (err){
  //     if(err instanceof RangeError){
  //       console.log('out of range');
  //     }
  //     console.log(err);
  //   }
  // }

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.loadingText = 'Aguarde...';
      this.loadingCidades = 'Buscando cidades...';
    } else {
      this.loadingText = 'Wait...';
      this.loadingCidades = 'Searching cities...';
    }
  }

}

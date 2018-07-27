import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { RamoEmpresaService } from '../../providers/ramo-empresa-service';
// import { VagaService } from '../../providers/vaga-service';

//ENTITYS
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';
import { RamoEmpresaEntity } from '../../model/ramo-empresa-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

//I18N
// import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-modal-filtro',
  templateUrl: 'modal-filtro.html',
})
export class ModalFiltroPage {

  public filtroForm: FormGroup;
  // languages = availableLanguages;
  selectedLanguage: any;
  // private translate: TranslateService;
  private estados = [];
  private cidades = [];
  private loading = null;
  private loadingCidades = null;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private ramoEmpresaEntity: RamoEmpresaEntity;
  private vagaDetalheEntity: VagaDetalheEntity;
  // private _idioma: string;

  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              // translate: TranslateService,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              private ramoEmpresaService: RamoEmpresaService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              private languageTranslateService: LanguageTranslateService,
              public viewCtrl: ViewController) {

      // this.translate = translate;
      this.usuarioDetalheEntity = new UsuarioDetalheEntity();
      this.ramoEmpresaEntity = new RamoEmpresaEntity();
      this.vagaDetalheEntity = new VagaDetalheEntity();

      this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ngOnInit() {
    this.getTraducao();
    this.filtroForm = this.formBuilder.group({
      'grauEntendimento': [''],
      'grauFala': [''],
      'grauEscrita': [''],
      'idRamoEmpresa': [''],
      'idEstado': [''],
      'idCidade': [''],
      'descricao': [''],
    });
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getIdRamoEmpresa();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  getIdRamoEmpresa() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      // this.vagaDetalheEntity = new VagaDetalheEntity();
      // this.vagaDetalheEntity = filtro;

      this.ramoEmpresaService.findAllRamoEmpresaAtivo()
        .then((ramoEntityResult: RamoEmpresaEntity) => {
          this.ramoEmpresaEntity = ramoEntityResult;
          
          console.log(this.ramoEmpresaEntity);

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

  getCidadesByEstadoPopOver(idEstado) {
    try {

      this.loadingCidades = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_CIDADES
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
    if (this.filtroForm.valid) {
      this.viewCtrl.dismiss({
        filter: this.vagaDetalheEntity
      });

    } else {
      Object.keys(this.filtroForm.controls).forEach(campo => {
        const controle = this.filtroForm.get(campo);
        controle.markAsTouched();
      })
    }
  }

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
  //       if(!this.selectedLanguage){
  //         this.selectedLanguage = this._idioma;
  //       }
  //       else if(this.selectedLanguage) {
  //         this.selectedLanguage = this.selectedLanguage;
  //         if (this.selectedLanguage == 'pt-br') {
  //           this.loadingText = 'Aguarde...';
  //           this.loadingCidades = 'Buscando cidades...';
  //         } else {
  //           this.loadingText = 'Wait...';
  //           this.loadingCidades = 'Searching cities...';
  //         }
  //       }
  //       this.translate.use(this.selectedLanguage);

  // }

}

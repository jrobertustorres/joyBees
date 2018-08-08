import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { RamoEmpresaService } from '../../providers/ramo-empresa-service';

//ENTITYS
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';
import { RamoEmpresaEntity } from '../../model/ramo-empresa-entity';
import { VagaDetalheEntity } from '../../model/vaga-detalhe-entity';

@IonicPage()
@Component({
  selector: 'page-modal-filtro',
  templateUrl: 'modal-filtro.html',
})
export class ModalFiltroPage {

  public filtroForm: FormGroup;
  selectedLanguage: any;
  private estados = [];
  private cidades = [];
  private ramoEmpresa: any = [];
  private loading = null;
  private loadingCidades = null;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private ramoEmpresaEntity: RamoEmpresaEntity;
  private vagaDetalheEntity: VagaDetalheEntity;

  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              private ramoEmpresaService: RamoEmpresaService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              private languageTranslateService: LanguageTranslateService,
              public viewCtrl: ViewController) {

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
    this.filtroForm.controls.idCidade.disable();
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
        this.getRamoEmpresa();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  getRamoEmpresa() {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      // this.vagaDetalheEntity = new VagaDetalheEntity();
      // this.vagaDetalheEntity = filtro;

      this.ramoEmpresaService.findAllRamoEmpresaAtivo()
        .then((ramoEntityResult) => {
          this.ramoEmpresa = ramoEntityResult;

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
        content: this.languageDictionary.LOADING_CIDADES,
      });
      this.loadingCidades.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;
          this.filtroForm.controls.idCidade.enable();
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

}

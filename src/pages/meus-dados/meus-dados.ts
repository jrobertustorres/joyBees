import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import {MaskMoneyUtil} from "../../utilitarios/maskMoney";

//UTILITARIOS
import { PasswordValidation } from '../../utilitarios/password-validation';

//ENTITYS
import { UsuarioEntity } from './../../model/usuario-entity';
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';

//PAGES
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

// SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { UsuarioService } from '../../providers/usuario-service';

// @IonicPage()
@Component({
  selector: 'page-meus-dados',
  templateUrl: 'meus-dados.html',
})
export class MeusDadosPage implements OnInit {
  public userChangeEvent = new EventEmitter();

  public dadosUsuarioForm: FormGroup;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  private isReadOnly: boolean;
  private dadosUsuarioFormat: any;
  private meusDadosFormat: any;

  public languageDictionary: any;

  private idUsuario: any;
  private nomePessoa: string;
  private isCadastroCompletoVaga: any;
  private isCadastroCompletoServico: any;
  public escondeIdade: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private usuarioService: UsuarioService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              private maskMoney: MaskMoneyUtil,
              private languageTranslateService: LanguageTranslateService) {

    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.usuarioEntity = new UsuarioEntity();
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
  }

  ngOnInit() {

    this.getTraducao();

    this.dadosUsuarioForm = this.formBuilder.group({
      'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
      'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'genero': ['', Validators.required],
      'idade': ['', Validators.required],
      'disponibilidadeMudanca': ['', Validators.required],
      'disponibilidadeHoraExtra': ['', Validators.required],
      'possuiFilhos': [''],
      'idadeFilhoCacula': [''],
      //'idadeFilhoCacula': ['', Validators.required],
      'nacionalidade': ['', [Validators.required, Validators.maxLength(100)]],
      'experienciaProfissional': ['', [Validators.required, Validators.maxLength(500)]],
      'grauEntendimento': ['', Validators.required],
      'grauFala': ['', Validators.required],
      'grauEscrita': ['', Validators.required],
      'salario': [''],
      'telefonePessoa': ['', [Validators.required, Validators.maxLength(50)]],
      'telefonePessoa2': ['', Validators.maxLength(50)],
      'senhaUsuario': [''],
      'confirmSenha': ['']
    }, {
        validator: PasswordValidation.MatchPassword
      }
    );
    if(!localStorage.getItem(Constants.TOKEN_USUARIO)){
      this.isReadOnly = false;
      this.dadosUsuarioForm.get('senhaUsuario').setValidators([Validators.required]);
    } else if(localStorage.getItem(Constants.TOKEN_USUARIO)) {
      this.isReadOnly = true;
    }
  }


  showIdadeFilhoCacula(event) {
    if(event == true || event == 'true') {
      this.escondeIdade = false;
    } else {
    this.escondeIdade = true;
    this.usuarioDetalheEntity.idadeFilhoCacula = null;
    }
  }

  ionViewDidLoad() {
    this.usuarioDetalheEntity.possuiFilhos = false;
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        if(localStorage.getItem(Constants.TOKEN_USUARIO)) {
          this.callGetDadosUsuario();
        }
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  getValorSalario(v) {
    this.usuarioDetalheEntity.salario = this.maskMoney.maskConvert(v);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.languageDictionary.TOAST_CADASTRO_ATUALIZADO,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  submeterDadosUsuario() {
    try {

      if (this.dadosUsuarioForm.valid) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
        });
        this.loading.present();

        // this.dadosUsuarioForm.value.salario = this.dadosUsuarioForm.value.salario.replace(",", "");
        // this.usuarioDetalheEntity.salario = this.dadosUsuarioForm.value.salario.replace(",", "");

        if(!localStorage.getItem(Constants.TOKEN_USUARIO)){
          this.cadastraUsuario();
        }
        else if(localStorage.getItem(Constants.TOKEN_USUARIO)) {
          this.editaUsuario();
        }
      } else {
        Object.keys(this.dadosUsuarioForm.controls).forEach(campo => {
          const controle = this.dadosUsuarioForm.get(campo);
          controle.markAsTouched();
        })
      }
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  cadastraUsuario() {
    this.meusDadosFormat = this.dadosUsuarioForm;
    this.meusDadosFormat.value.salario = this.dadosUsuarioForm.value.salario ? this.dadosUsuarioForm.value.salario.replace(",", "") : null;

    // this.dadosUsuarioForm.value.salario = this.dadosUsuarioForm.value.salario.replace(",", "");

    this.meusDadosFormat.value.idiomaUsuario = localStorage.getItem(Constants.IDIOMA_USUARIO);
    this.usuarioService
    .adicionaUsuarioBasico(this.meusDadosFormat.value)
    .then((usuarioEntityResult: UsuarioEntity) => {

      this.isCadastroCompletoVaga = usuarioEntityResult.isCadastroCompletoVaga;
      localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_VAGA, this.isCadastroCompletoVaga);
      this.isCadastroCompletoServico = usuarioEntityResult.isCadastroCompletoServico;
      localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_SERVICO, this.isCadastroCompletoServico);

      this.loading.dismiss();
      this.navCtrl.setRoot(PrincipalPage);
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  editaUsuario() {
    this.dadosUsuarioFormat = this.usuarioDetalheEntity;
    this.dadosUsuarioFormat.salario = this.dadosUsuarioForm.value.salario.replace(",", "");
    this.usuarioService
    .atualizaUsuario(this.dadosUsuarioFormat)
    .then((usuarioDetalheEntityResult: UsuarioDetalheEntity) => {
      this.nomePessoa = usuarioDetalheEntityResult.nomePessoa;

      this.isCadastroCompletoVaga = usuarioDetalheEntityResult.isCadastroCompletoVaga;
      localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_VAGA, this.isCadastroCompletoVaga);
      this.isCadastroCompletoServico = usuarioDetalheEntityResult.isCadastroCompletoServico;
      localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_SERVICO, this.isCadastroCompletoServico);

      this.loading.dismiss();
      this.presentToast();
      setTimeout(() => {
        this.navCtrl.setRoot(ConfiguracoesPage);
      }, 3000);
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });

  }

  callGetDadosUsuario() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
      });
      this.loading.present();

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;

          if(this.usuarioDetalheEntity.possuiFilhos) {
            this.escondeIdade = false;
          } else {
            this.escondeIdade = true;
          }

          let salario: any = this.usuarioDetalheEntity.salario;
          salario = salario.toString().split( /(?=(?:\d{3})+(?:\.|$))/g ).join( "," );
          this.usuarioDetalheEntity.salario = salario;

          this.loading.dismiss();
          // this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);
        })
        .catch(err => {
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

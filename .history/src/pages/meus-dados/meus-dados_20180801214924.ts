import { Component, OnInit, EventEmitter } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import {MaskMoneyUtil} from "../../utilitarios/maskMoney";

// import { Storage } from '@ionic/storage';

//UTILITARIOS
import { PasswordValidation } from '../../utilitarios/password-validation';

//ENTITYS
import { UsuarioEntity } from './../../model/usuario-entity';
import { UsuarioDetalheEntity } from './../../model/usuario-detalhe-entity';

//PAGES
// import { HomePage } from '../home/home';
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
// import { ModalTermosPage } from '../modal-termos/modal-termos';

// SERVICES
// import { CadastroUsuarioService } from '../../providers/cadastro-usuario-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';
// import { EstadosService } from '../../providers/estados-service';
// import { CidadesService } from '../../providers/cidades-service';
import { UsuarioService } from '../../providers/usuario-service';

//I18N
// import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

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
  // private estados = [];
  // private cidades = [];
  private isReadOnly: boolean;
  private dadosUsuarioFormat: any;

  // private salario: string;

  public languageDictionary: any;

  private idUsuario: any;
  // private tokenUsuario: any;
  private nomePessoa: string;
  private isCadastroCompletoVaga: any;
  private isCadastroCompletoServico: any;
  // public salario: any;

  // languages = availableLanguages;
  // private translate: TranslateService;
  // private messagePresentToast: string;
  // selectedLanguage = null;
  // private _idioma: string;

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

    // this.translate = translate;

    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.usuarioEntity = new UsuarioEntity();
    // this.isReadOnly = false;
    this.idUsuario = localStorage.getItem(Constants.ID_USUARIO);
  }

  ngOnInit() {

    this.getTraducao();

    this.dadosUsuarioForm = this.formBuilder.group({
      'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
      'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'genero': ['', Validators.required],
      'idade': ['', Validators.required],
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
      // 'endereco': ['', [Validators.required, Validators.maxLength(300)]],
      // 'idEstado': ['', Validators.required],
      // 'idCidade': ['', Validators.required],
      // 'statusAceitoTermoUso': ['false']
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      }
    );

    // if(!localStorage.getItem(Constants.ID_USUARIO)){
    //   this.dadosUsuarioForm.get('senhaUsuario').setValidators([Validators.required]);
    // }
    // else if(localStorage.getItem(Constants.ID_USUARIO)) {
    //     this.callGetDadosUsuario();
    // }

    // this.estadosService
    //   .getEstados()
    //   .subscribe(dados => {
    //   this.estados = dados;
    // });

  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        if(!localStorage.getItem(Constants.TOKEN_USUARIO)){
          this.isReadOnly = false;
          this.dadosUsuarioForm.get('senhaUsuario').setValidators([Validators.required]);
        }
        else if(localStorage.getItem(Constants.TOKEN_USUARIO)) {
          this.isReadOnly = true;
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

  // getCidadesByEstadoUsuario(idEstado) {
  //   try {

  //     this.cidadesService
  //       .getCidades(idEstado)
  //       .then((listCidadesResult) => {
  //         this.cidades = listCidadesResult;
  //         this.loading.dismiss();
  //       })
  //       .catch(err => {
  //         this.loading.dismiss();
  //         this.alertCtrl.create({
  //           subTitle: err.message,
  //           buttons: ['OK']
  //         }).present();
  //       });
  //   }catch (err){
  //     if(err instanceof RangeError){
  //     }
  //     console.log(err);
  //   }
  // }

  // openModalTermosCadastro(){
  //   let modal = this.modalCtrl.create(ModalTermosPage);
  //   modal.present();
  // }

  submeterDadosUsuario() {
    try {

      if (this.dadosUsuarioForm.valid) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT
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
    this.dadosUsuarioForm.value.salario = this.dadosUsuarioForm.value.salario.replace(",", "");
    this.dadosUsuarioForm.value.idiomaUsuario = localStorage.getItem(Constants.IDIOMA_USUARIO);
    this.usuarioService
    .adicionaUsuarioBasico(this.dadosUsuarioForm.value)
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
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;

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

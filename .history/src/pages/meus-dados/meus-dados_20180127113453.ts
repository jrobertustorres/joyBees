import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

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
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { UsuarioService } from '../../providers/usuario-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

// @IonicPage()
@Component({
  selector: 'page-meus-dados',
  templateUrl: 'meus-dados.html',
})
export class MeusDadosPage implements OnInit {

  public dadosUsuarioForm: FormGroup;
  private usuarioDetalheEntity: UsuarioDetalheEntity;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  private loadingDados = null;
  private loadingCidades = null;
  private estados = [];
  private cidades = [];
  private isReadOnly: boolean;

  private idUsuario: any;
  private tokenUsuario: any;
  private nomePessoa: string;

  languages = availableLanguages;
  // selectedLanguage = sysOptions.systemLanguage;
  private translate: TranslateService;
  // private loadingText: string;
  private messagePresentToast: string;
  selectedLanguage = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private estadosService: EstadosService, 
              private cidadesService: CidadesService,
              private usuarioService: UsuarioService,
              private formBuilder: FormBuilder,
              private toastCtrl: ToastController,
              public modalCtrl: ModalController,
              translate: TranslateService) {

    this.translate = translate;
    this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
    this.translate.use(this.selectedLanguage);        

    this.usuarioDetalheEntity = new UsuarioDetalheEntity();
    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {

    this.dadosUsuarioForm = this.formBuilder.group({
      'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
      'email': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'genero': ['', Validators.required],
      'idade': ['', Validators.required],
      'nacionalidade': ['', [Validators.required, Validators.maxLength(100)]],
      'experienciaProfissional': ['', [Validators.required, Validators.maxLength(500)]],
      'grauEntendimento': ['', [Validators.required, Validators.maxLength(30)]],
      'grauFala': ['', [Validators.required, Validators.maxLength(30)]],
      'grauEscrita': ['', [Validators.required, Validators.maxLength(30)]],
      'salario': [''],
      'endereco': ['', [Validators.required, Validators.maxLength(300)]],
      'telefonePessoa': ['', Validators.maxLength(50)],
      'telefonePessoa2': ['', Validators.maxLength(50)],
      'idEstado': ['', Validators.required],
      'idCidade': ['', Validators.required],
      'senhaUsuario': [''],
      'confirmSenha': ['']
      // 'statusAceitoTermoUso': ['false']
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      }
    );

  //  localStorage.removeItem(Constants.ID_USUARIO);

    this.isReadOnly = localStorage.getItem(Constants.ID_USUARIO) ? true : false;
    if (localStorage.getItem(Constants.ID_USUARIO)) {
      this.getDadosUsuario();
    } else {
      this.dadosUsuarioForm.get('senhaUsuario').setValidators([Validators.required]);
    }

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });

  }

  ionViewDidLoad() {
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.messagePresentToast,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getCidadesByEstadoUsuario(idEstado) {
    try {
      if (this.selectedLanguage == 'pt-br') {
        this.messagePresentToast = 'Cadastro atualizado!';
        this.loadingCidades = 'Buscando cidades...';
      } else {
        this.messagePresentToast = 'Updated registration!';
        this.loadingCidades = 'Searching cities...';
      }
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

  // openModalTermosCadastro(){
  //   let modal = this.modalCtrl.create(ModalTermosPage);
  //   modal.present();
  // }

  submeterDadosUsuario() {
    try {

      console.log(this.dadosUsuarioForm.valid);
      console.log(this.dadosUsuarioForm.value);

      if (this.dadosUsuarioForm.valid) {
        if (this.selectedLanguage == 'pt-br') {
          this.loading = 'Aguarde...';
        } else {
          this.loading = 'Wait...';
        }
        this.loading = this.loadingCtrl.create({
          content: this.loading
        });
        this.loading.present();

        if (localStorage.getItem(Constants.ID_USUARIO) != null) {
          this.editaUsuario();
        } else {
          this.cadastraUsuario();
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
    this.usuarioService
    .cadastraUsuario(this.dadosUsuarioForm.value)
    .then((usuarioEntityResult: UsuarioEntity) => {

      this.idUsuario = usuarioEntityResult.idUsuario;
      this.tokenUsuario = usuarioEntityResult.token;
      this.nomePessoa = usuarioEntityResult.nomePessoa;

      localStorage.setItem(Constants.ID_USUARIO, this.idUsuario);
      localStorage.setItem(Constants.TOKEN_USUARIO, this.tokenUsuario);
      localStorage.setItem(Constants.NOME_PESSOA, this.nomePessoa);

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
    console.log(this.usuarioDetalheEntity);

    this.usuarioService
    .atualizaUsuario(this.usuarioDetalheEntity)
    .then((usuarioDetalheEntityResult: UsuarioDetalheEntity) => {
      this.nomePessoa = usuarioDetalheEntityResult.nomePessoa;

      localStorage.setItem(Constants.NOME_PESSOA, this.nomePessoa);

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

  getDadosUsuario() {
    try {
      if (this.selectedLanguage == 'pt-br') {
        this.loadingDados = 'Buscando dados...';
      } else {
        this.loadingDados = 'Searching data...';
      }
      this.loadingDados = this.loadingCtrl.create({
        content: this.loadingDados
      });
      this.loadingDados.present();

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;
          this.loadingDados.dismiss();

          this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);
        })
        .catch(err => {
          this.loadingDados.dismiss();
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
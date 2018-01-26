import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';

//PAGES
// import { HomePage } from '../home/home';
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { ModalTermosPage } from '../modal-termos/modal-termos';

// SERVICES
// import { CadastroUsuarioService } from '../../providers/cadastro-usuario-service';
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-services';
import { UsuarioService } from '../../providers/usuario-service';

//UTILITARIOS
// import { PasswordValidation } from '../utilitarios/password-validation';

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
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  private loadingDados = null;
  private loadingCidades = null;
  private estados = [];
  private cidades = [];
  private isReadOnly: boolean;

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

    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {

    this.dadosUsuarioForm = this.formBuilder.group({
      'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
      'loginUsuario': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
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
    }
    // , {
    //     validator: PasswordValidation.MatchPassword // your validation method
    //   }
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
    console.log(idEstado);
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
      // this.loadingCidades = this.loadingCtrl.create({
      //   content: 'Buscando cidades...',
      //   dismissOnPageChange: true
      // });
      // this.loadingCidades.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;
          console.log(this.cidades);
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

  openModalTermosCadastro(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

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
        // this.loading = this.loadingCtrl.create({
        //   content: 'Aguarde...'
        // });
        // this.loading.present();

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

      let idUsuario: any;
      let tokenUsuario: any;
      let tipoUsuario: string;
      let nomePessoa: string;

      idUsuario = usuarioEntityResult.idUsuario;
      tokenUsuario = usuarioEntityResult.token;
      tipoUsuario = usuarioEntityResult.tipoUsuario;
      nomePessoa = usuarioEntityResult.nomePessoa;

      localStorage.setItem(Constants.ID_USUARIO, idUsuario);
      localStorage.setItem(Constants.TOKEN_USUARIO, tokenUsuario);
      localStorage.setItem(Constants.TIPO_USUARIO, tipoUsuario);
      localStorage.setItem(Constants.NOME_PESSOA, nomePessoa);

      this.loading.dismiss();
      this.navCtrl.setRoot(PrincipalPage);
      // this.navCtrl.setRoot(HomePage,{previousPage:'MeusDadosPage'});
    }, (err) => {
      this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

  editaUsuario() {
    console.log(this.usuarioEntity);

    this.usuarioService
    .atualizaUsuario(this.usuarioEntity)
    .then((usuarioEntityResult: UsuarioEntity) => {

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
      // this.loadingDados = this.loadingCtrl.create({
      //   content: 'Buscando dados...'
      // });
      // this.loadingDados.present();
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
        .then((dadosUsuarioResult) => {
          this.usuarioEntity = dadosUsuarioResult;
          this.loadingDados.dismiss();

          this.getCidadesByEstadoUsuario(dadosUsuarioResult.idEstado);
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

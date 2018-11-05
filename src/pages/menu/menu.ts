import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController, Platform, ActionSheetController  } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {DomSanitizer} from '@angular/platform-browser';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';
import { UsuarioDetalheEntity } from '../../model/usuario-detalhe-entity';
import { VersaoAppEntity } from '../../model/versao-app-entity';

//PAGES
import { HomePage } from '../home/home';
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { VagasCandidatadasPage } from '../vagas-candidatadas/vagas-candidatadas';
import { OrcamentoPrincipalPage } from '../orcamento-principal/orcamento-principal';
import { VagasEmDestaquePage } from '../vagas-em-destaque/vagas-em-destaque';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';

//SERVICES
import { LoginService } from '../../providers/login-service';
import { UsuarioService } from '../../providers/usuario-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { VersaoAppService } from '../../providers/versao-app-service';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit{
  @ViewChild('content') nav: Nav;
  rootPage:any;
  public nomePessoa: string;
  public loginPessoa: string;
  pages: Array<{title: string, component: any, isVisible: boolean, icon: string}>;
  public languageDictionary: any;

  private translate: TranslateService;
  private usuarioEntity: UsuarioEntity;
  private versaoAppEntity: VersaoAppEntity;

  private sairLogout: string;
  private configuracoes: string;
  private home: string;
  private vagas: string;
  private orcamentos: string;
  private candidaturas: string;
  private loading = null;
  private alterarFoto: string;

  cameraData: string = null;
  photoTaken: boolean = false;
  cameraUrl: string = null;
  photoSelected: boolean = false;

  private _idUsuario: any;
  private _idUsuarioFacebook: any;

  private versao: any;

  constructor(public navParams: NavParams,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              translate: TranslateService,
              private languageProvider: LanguageProvider,
              public loginService: LoginService,
              public usuarioService: UsuarioService,
              private camera: Camera,
              public platform: Platform,
              private sanitizer: DomSanitizer,
              private versaoAppService: VersaoAppService,
              private languageTranslateService: LanguageTranslateService,
              public actionSheetCtrl: ActionSheetController) {

    this.usuarioEntity = new UsuarioEntity();
    this.versaoAppEntity = new VersaoAppEntity();
  }

  ngOnInit() {
    this.usuarioService.userChangeEvent.subscribe(nomePessoa => {
      this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
    });
    this.loginService.userChangeEvent.subscribe(nomePessoa => {
      this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
    });
    this.loginService.emailPessoaChangeEvent.subscribe(login => {
      this.loginPessoa = login.split(/(\s).+\s/).join("");
    });
    this.loginService.photoChangeEvent.subscribe(foto => {
      this.getFotoPerfil();
    });

    this.getTraducao();
    if(localStorage.getItem(Constants.ID_USUARIO)) {
      this.getFotoPerfil();
    }
    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
      this.getTraducaoEmited(); // aqui temos a chamar novamente para funcionar a alteração da linguagem no menu
    });
    this.loginService.languageChangeEvent.subscribe(selectedLanguage => {
      this.getTraducaoEmited(); // aqui temos a chamar novamente para funcionar a alteração da linguagem no menu
    });
  }

  ionViewDidLoad() {
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        this.getAtualizacaoStatus();

      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  getTraducaoEmited() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
        if(localStorage.getItem(Constants.ID_USUARIO)) {
          this.constroiMenu();
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

  verificaIdUsuario() {
    if(!localStorage.getItem(Constants.ID_USUARIO)){
      this.loading.dismiss();
      this.rootPage = HomePage;
    }
    else if(localStorage.getItem(Constants.ID_USUARIO)) {
      this.callLoginByIdService(localStorage.getItem(Constants.ID_USUARIO));
    }
  }

  getAtualizacaoStatus() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT_AUT,
      });
      this.loading.present();

      this.versaoAppEntity.versao = localStorage.getItem(Constants.VERSION_NUMBER);
      this.versaoAppEntity.tipoAplicativoEnum = 'CLIENTE';

      this.versaoAppService.versaoApp(this.versaoAppEntity)
      .then((versaoResult: VersaoAppEntity) => {
        this.versao = versaoResult;

        if(this.versao.descontinuado == true) {
          this.showAlertVersao(this.versao);
        } else {
          this.verificaIdUsuario();
        }

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

  showAlertVersao(versao) {
    const alert = this.alertCtrl.create({
      title: this.languageDictionary.TITLE_ATUALIZACAO_APP,
      subTitle: this.languageDictionary.SUBTITLE_ATUALIZACAO_APP,
      buttons: [
        {
        text: 'OK',
          handler: () => {
            this.getPlatform(versao);
          }
      }]
    });
    alert.present();
  }

  getPlatform(versao) {
    if (this.platform.is('ios')) {
      window.open(versao.linkIos, '_system', 'location=yes');
      this.platform.exitApp();
    }

    if (this.platform.is('android')) {
      window.open(versao.linkAndroid, '_system', 'location=yes');
      this.platform.exitApp();
    }
  }

  getFotoPerfil() {
    if(localStorage.getItem(Constants.CAMERA_DATA) != 'null'){
      this.cameraData = localStorage.getItem(Constants.CAMERA_DATA);
      this.photoTaken = true;
      this.photoSelected = false;
    } else {
        if(localStorage.getItem(Constants.CAMERA_URL)){
          this.cameraUrl = localStorage.getItem(Constants.CAMERA_URL);
          this.photoTaken = false;
          this.photoSelected = true;
        } else {
          this.photoTaken = false;
          this.photoSelected = false;
          this.cameraData = null;
          this.cameraUrl = null;
        }
    }
  }

  takePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.alterarFoto,
      buttons: [
        {
          text: this.languageDictionary.BTN_ABRIR_CAMERA,
          icon: !this.platform.is('ios') ? 'md-camera' : null,
          handler: () => {
            this.openCamera();
          }
        },{
          text: this.languageDictionary.BTN_ABRIR_GALERIA,
          icon: !this.platform.is('ios') ? 'md-images' : null,
          handler: () => {
            this.selectFromGallery();
          }
        }
        ,{
          text: this.languageDictionary.CANCELAR,
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  selectFromGallery() {
    var options = {
      quality: 60,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      this.cameraUrl = 'data:image/jpeg;base64,' + imageData;
      localStorage.setItem(Constants.CAMERA_URL, this.cameraUrl);
      this.photoSelected = true;
      this.photoTaken = false;
      this.callCadastraImagemUsuario(this.cameraUrl);

    }, (err) => {
    });
  }

  openCamera() {
    var options = {
      quality: 60,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      this.cameraData = 'data:image/jpeg;base64,' + imageData;
      localStorage.setItem(Constants.CAMERA_DATA, this.cameraData);
      this.photoTaken = true;
      this.photoSelected = false;
      this.callCadastraImagemUsuario(this.cameraData);

    }, (err) => {
    });
  }

  constroiMenu() {
    this.pages = [
      { title: 'Home', component: PrincipalPage, isVisible: true, icon: 'ios-home' },
      { title: this.languageDictionary.VAGAS_EMPREGO, component: VagasEmDestaquePage, isVisible: true, icon: 'ios-search' },
      { title: this.languageDictionary.VAGA_CANDIDATADAS, component: VagasCandidatadasPage, isVisible: true, icon: 'ios-briefcase' },
      { title: this.languageDictionary.ORCAMENTOS, component: OrcamentoPrincipalPage, isVisible: true, icon: 'ios-clipboard' },
      // { title: this.languageDictionary.PEDIDOS, component: OrcamentoPrincipalPage, isVisible: true, icon: 'ios-cart' },
      { title: this.languageDictionary.CONFIGURACOES, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
    ];

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  callCadastraImagemUsuario(imagemPessoaBs64) {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.usuarioEntity.imagemPessoaBs64 = imagemPessoaBs64;
      this.usuarioService
      .cadastraImagemUsuario(this.usuarioEntity)
      .then((usuarioDetalheEntityResult: UsuarioDetalheEntity ) => {
        this.loading.dismiss();
      }, (err) => {
        this.loading.dismiss();
        this.alertCtrl.create({
          subTitle: err.message,
          buttons: ['OK']
        }).present();
      });
    } catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  callLoginByIdService(idUsuario) {

    try {

      this.usuarioEntity.idUsuario = idUsuario;
      this.loginService.loginByIdService(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {
          this.loading.dismiss();
          this.rootPage = PrincipalPage;

        }, (err) => {
          this.loading.dismiss();
          err.message = err.message ? err.message : this.languageDictionary.LABEL_FALHA_CONEXAO_SERVIDOR;
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.logout();
              }
            }]
            // buttons: ['OK']
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

  logout() {
    localStorage.removeItem(Constants.ID_USUARIO);
    localStorage.removeItem(Constants.TOKEN_USUARIO);
    localStorage.removeItem(Constants.NOME_PESSOA);
    this.nav.setRoot(HomePage);
    this.menuCtrl.close();
  }

  confirmaLogout() {
    let alert = this.alertCtrl.create({
      subTitle: this.languageDictionary.BTN_SUBTITLE_LOGOUT,
      buttons: [
        {
          text: this.languageDictionary.BTN_FICAR,
          role: 'cancel'
        },
        {
          text: this.languageDictionary.SAIR_UPPER,
          handler: () => {

            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            localStorage.removeItem(Constants.ID_VAGA_CANDIDATAR);
            localStorage.removeItem(Constants.IS_CADASTRO_COMPLETO_VAGA);
            localStorage.removeItem(Constants.IS_CADASTRO_COMPLETO_SERVICO);
            localStorage.removeItem(Constants.CAMERA_URL);
            localStorage.removeItem(Constants.CAMERA_DATA);
            // localStorage.removeItem(Constants.IDIOMA_USUARIO);
            localStorage.removeItem(Constants.DADOS_USUARIO_FACEBOOK);
            // localStorage.removeItem('userFacebook');
            // this.nativeStorage.remove(Constants.ID_VAGA_CANDIDATAR);
            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

}

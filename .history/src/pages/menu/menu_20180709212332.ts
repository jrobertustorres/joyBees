import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform, ActionSheetController } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';
import { UsuarioDetalheEntity } from '../../model/usuario-detalhe-entity';

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
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { LoginService } from '../../providers/login-service';
import { UsuarioService } from '../../providers/usuario-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

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

  // languages = availableLanguages;
  // selectedLanguage: any;
  private translate: TranslateService;
  private usuarioEntity: UsuarioEntity;

  // private subTitleLogout: string;
  // private cancelLogout: string;
  private sairLogout: string;
  private configuracoes: string;
  private home: string;
  private vagas: string;
  private orcamentos: string;
  // private loadingText: string;
  private candidaturas: string;
  private loading = null;
  private alterarFoto: string;
  // private abrirCamera: string;
  // private abrirGaleria: string;
  // private cancelar: string;

  cameraData: string = null;
  photoTaken: boolean = false;
  cameraUrl: string = null;
  photoSelected: boolean = false;
  // private _idioma: string;

  private _idUsuario: any;
  private _idUsuarioFacebook: any;

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
              private languageTranslateService: LanguageTranslateService,
              public actionSheetCtrl: ActionSheetController) {

      this.usuarioEntity = new UsuarioEntity();

      // this.translate = translate;

      this.getFotoPerfil();

  }

  ngOnInit() {
    this.getTraducao();
    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
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
        this.verificaIdUsuario();

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
        this.constroiMenu();

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
    if(localStorage.getItem(Constants.ID_USUARIO)!=null) {
      this.callLoginByIdService(localStorage.getItem(Constants.ID_USUARIO));
    } else {
      this.rootPage = HomePage;
    }
  }

  getFotoPerfil() {
    console.log(this.cameraUrl);
    console.log(this.cameraData);

    if(localStorage.getItem(Constants.CAMERA_DATA)){
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
        }
    }
  }

  // loginFacebook() {
  //   let env = this;
  //   this._storage.get('userFacebook')
  //   .then( function (data) {
  //     // user is previously logged and we have his data
  //     // we will let him access the app
  //     // env.nav.push(UserPage);
  //     // env.splashScreen.hide();
  //   }, function (error) {
  //     //we don't have the user data so we will ask him to log in
  //     // env.nav.push(LoginPage);
  //     // env.splashScreen.hide();
  //   });
  // }

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
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      // this.cameraUrl = 'data:image/jpeg;base64,' + imageData;
      // localStorage.setItem(Constants.CAMERA_URL, this.cameraUrl);
      this.cameraData = 'data:image/jpeg;base64,' + imageData;
      localStorage.setItem(Constants.CAMERA_URL, this.cameraData);
      this.photoSelected = true;
      this.photoTaken = false;
      this.callCadastraImagemUsuario(this.cameraData);
      // this.callCadastraImagemUsuario(this.cameraUrl);

    }, (err) => {
    });
  }

  openCamera() {
    var options = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
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
    console.log('dentro do constroi menu');
    // this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
    //   this.selectedLanguage = selectedLanguage;
    //   console.log(selectedLanguage);
    //   localStorage.setItem(Constants.IDIOMA_USUARIO, selectedLanguage);
    //   this.getTraducao(); // aqui temos a chamar novamente para funcionar a alteração da linguagem
    // });

    this.loginService.userChangeEvent.subscribe(nomePessoa => {
      this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
    });
    this.loginService.emailPessoaChangeEvent.subscribe(login => {
      this.loginPessoa = login.split(/(\s).+\s/).join("");
    });
    this.pages = [
      { title: 'Home', component: PrincipalPage, isVisible: true, icon: 'ios-home' },
      { title: this.languageDictionary.ORCAMENTOS, component: OrcamentoPrincipalPage, isVisible: true, icon: 'ios-list-box' },
      { title: this.languageDictionary.VAGAS_EMPREGO, component: VagasEmDestaquePage, isVisible: true, icon: 'ios-search' },
      { title: this.languageDictionary.VAGA_CANDIDATADAS, component: VagasCandidatadasPage, isVisible: true, icon: 'ios-briefcase' },
      { title: this.languageDictionary.CONFIGURACOES, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
    ];

    // this.loginService.userChangeEvent.subscribe(nomePessoa => {
    //   this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
    // });
    // this.loginService.emailPessoaChangeEvent.subscribe(login => {
    //   this.loginPessoa = login.split(/(\s).+\s/).join("");
    // });

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
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.usuarioEntity.idUsuario = idUsuario;
      this.loginService.loginByIdService(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {
          this.constroiMenu();
          this.rootPage = PrincipalPage;
          this.loading.dismiss();

      }, (err) => {
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

  logout() {
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
            // this._storage.remove(Constants.ID_USUARIO);
            // this._storage.remove(Constants.TOKEN_USUARIO);
            // this._storage.remove(Constants.NOME_PESSOA);
            // this._storage.remove(Constants.ID_VAGA_CANDIDATAR);
            // this._storage.remove(Constants.IS_CADASTRO_COMPLETO);
            // this._storage.remove(Constants.CAMERA_URL);
            // this._storage.remove(Constants.CAMERA_DATA);
            // this._storage.remove(Constants.IDIOMA_USUARIO);
            // this._storage.remove('userFacebook');

            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            localStorage.removeItem(Constants.ID_VAGA_CANDIDATAR);
            localStorage.removeItem(Constants.IS_CADASTRO_COMPLETO);
            localStorage.removeItem(Constants.CAMERA_URL);
            localStorage.removeItem(Constants.CAMERA_DATA);
            // localStorage.removeItem(Constants.IDIOMA_USUARIO);
            localStorage.removeItem('userFacebook');
            // this.nativeStorage.remove(Constants.ID_VAGA_CANDIDATAR);
            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';

  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);

  //   if(!this.selectedLanguage){
  //     this.selectedLanguage = this._idioma;
  //   } else if(this.selectedLanguage) {
  //     this.selectedLanguage = this.selectedLanguage;

  //     if (this.selectedLanguage == 'pt-br') {
  //       this.loadingText = 'Aguarde...';
  //       this.subTitleLogout = 'Deseja realmente sair?';
  //       this.cancelLogout = 'FICAR';
  //       this.sairLogout = 'SAIR';
  //       this.vagas = 'Vagas de emprego';
  //       this.home = 'Home';
  //       this.orcamentos = 'Orçamentos';
  //       this.configuracoes = 'Configurações';
  //       this.candidaturas = 'Vagas candidatadas';
  //       this.alterarFoto = 'Alterar foto';
  //       this.abrirCamera = 'Abrir câmera';
  //       this.abrirGaleria = 'Abrir galeria';
  //       this.cancelar = 'Cancelar';
  //     } else {
  //       this.loadingText = 'Wait...';
  //       this.subTitleLogout = 'Are you sure you want to log out?';
  //       this.cancelLogout = 'STAY';
  //       this.sairLogout = 'LOG OUT';
  //       this.vagas = 'Jobs';
  //       this.home = 'Home';
  //       this.orcamentos = 'Quotes';
  //       this.configuracoes = 'Settings';
  //       this.candidaturas = 'Candidate applications';
  //       this.alterarFoto = 'Change photo';
  //       this.abrirCamera = 'Open camera';
  //       this.abrirGaleria = 'Open Gallery';
  //       this.cancelar = 'Cancel';
  //     }
  //     this.constroiMenu();
  //     // this.loginService.userChangeEvent.subscribe(nomePessoa => {
  //     //   this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
  //     // });
  //     // this.loginService.emailPessoaChangeEvent.subscribe(login => {
  //     //   this.loginPessoa = login.split(/(\s).+\s/).join("");
  //     // });
  //     // this.pages = [
  //     //   { title: this.home, component: PrincipalPage, isVisible: true, icon: 'ios-home' },
  //     //   { title: this.orcamentos, component: OrcamentoPrincipalPage, isVisible: true, icon: 'ios-list-box' },
  //     //   { title: this.vagas, component: VagasEmDestaquePage, isVisible: true, icon: 'ios-search' },
  //     //   { title: this.candidaturas, component: VagasCandidatadasPage, isVisible: true, icon: 'ios-briefcase' },
  //     //   { title: this.configuracoes, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
  //     // ];
  //   }
  //   this.translate.use(this.selectedLanguage);

  // }

}

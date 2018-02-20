import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform, ActionSheetController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';
import { UsuarioDetalheEntity } from '../../model/usuario-detalhe-entity';

//PAGES
import { HomePage } from '../home/home';
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';
import { VagasCandidatadasPage } from '../vagas-candidatadas/vagas-candidatadas';

//PROVIDERS
import { LanguageProvider } from '../../providers/language-provider';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//SERVICES
import { LoginService } from '../../providers/login-service';
import { UsuarioService } from '../../providers/usuario-service';

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

  languages = availableLanguages;
  selectedLanguage: any;
  private translate: TranslateService;
  private usuarioEntity: UsuarioEntity;

  private subTitleLogout: string;
  private cancelLogout: string;
  private sairLogout: string;
  private configuracoes: string;
  private vagas: string;
  private loadingText: string;
  private candidaturas: string;
  private loading = null;
  private alterarFoto: string;
  private abrirCamera: string;
  private abrirGaleria: string;
  private cancelar: string;

  cameraData: any;
  photoTaken: boolean;
  cameraUrl: any;
  photoSelected: boolean;
  private _idioma: string;

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
              private _storage: Storage,
              public actionSheetCtrl: ActionSheetController) {

      this.usuarioEntity = new UsuarioEntity();

      this.translate = translate;
      this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
      // this.selectedLanguage = localStorage.getItem('selectedLanguage') == null ? this._idioma : localStorage.getItem('selectedLanguage');
      // this.translate.use(this.selectedLanguage);

      this._storage.get('selectedLanguage').then((selectedLanguage) => {
        if(!selectedLanguage){
          this.selectedLanguage = this._idioma;
        }
        else if(selectedLanguage) {
          this.selectedLanguage = selectedLanguage;
        }
        this.translate.use(this.selectedLanguage);
        // this.languageProvider.getLanguageProvider(this.selectedLanguage);
      });

      this.getFotoPerfil();

      try {

        this._storage.get(Constants.ID_USUARIO).then((idUsuario) => {
          if(!idUsuario){
            this.rootPage = HomePage;
          }
          else if(idUsuario) {
            localStorage.setItem(Constants.ID_USUARIO, idUsuario);
            this.callLoginByIdService();
          }
        });

        //ERA ASSIM ANTES
        // if(localStorage.getItem(Constants.ID_USUARIO)!=null) {
        //   this.callLoginByIdService();
        // } else {
        //   this.rootPage = HomePage;
        // }
      }
      catch (err){
        // this.trataExcessao(null);
      }
  }

  ngOnInit() {
    this.getLanguage();
    this.constroiMenu();
  }

  ionViewDidLoad() {
  }

  loginFacebook() {
    let env = this;
    this._storage.get('user')
    .then( function (data) {
      // user is previously logged and we have his data
      // we will let him access the app
      // env.nav.push(UserPage);
      // env.splashScreen.hide();
    }, function (error) {
      //we don't have the user data so we will ask him to log in
      // env.nav.push(LoginPage);
      // env.splashScreen.hide();
    });
  }

  takePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.alterarFoto,
      buttons: [
        {
          text: this.abrirCamera,
          icon: !this.platform.is('ios') ? 'md-camera' : null,
          handler: () => {
            this.openCamera();
          }
        },{
          text: this.abrirGaleria,
          icon: !this.platform.is('ios') ? 'md-images' : null,
          handler: () => {
            this.selectFromGallery();
          }
        }
        ,{
          text: this.cancelar,
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
      console.log(imageData);
      this.cameraUrl = 'data:image/jpeg;base64,' + imageData;
      this._storage.set(Constants.CAMERA_URL, this.cameraUrl);
      // localStorage.setItem(Constants.CAMERA_URL, this.cameraUrl);
      this.photoSelected = true;
      this.photoTaken = false;
      this.callCadastraImagemUsuario(this.cameraUrl);

      console.log(this.cameraUrl);
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
      this._storage.set(Constants.CAMERA_DATA, this.cameraData);
      // localStorage.setItem(Constants.CAMERA_DATA, this.cameraData);
      this.photoTaken = true;
      this.photoSelected = false;
      this.callCadastraImagemUsuario(this.cameraData);

      console.log(this.cameraData);
    }, (err) => {
    });
  }

  constroiMenu() {
    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
      this.selectedLanguage = selectedLanguage;
      this.getLanguage(); // aqui temos a chamar novamente para funcionar a alteração da linguagem
      this.pages = [
        { title: this.vagas, component: PrincipalPage, isVisible: true, icon: 'ios-search' },
        { title: this.candidaturas, component: VagasCandidatadasPage, isVisible: true, icon: 'ios-briefcase' },
        { title: this.configuracoes, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
      ];
    });

    this.loginService.userChangeEvent.subscribe(nomePessoa => {
      this.nomePessoa = nomePessoa.split(/(\s).+\s/).join("");
    });
    this.loginService.emailPessoaChangeEvent.subscribe(login => {
      this.loginPessoa = login.split(/(\s).+\s/).join("");
    });

    this.pages = [
      { title: this.vagas, component: PrincipalPage, isVisible: true, icon: 'ios-search' },
      { title: this.candidaturas, component: VagasCandidatadasPage, isVisible: true, icon: 'ios-briefcase' },
      { title: this.configuracoes, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
    ];

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  callCadastraImagemUsuario(imagemPessoaBs64) {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
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

  callLoginByIdService() {
  
    try {
      this.loading = this.loadingCtrl.create({
        content: this.loadingText
      });
      this.loading.present();

      let idUsuario: any;

      idUsuario = localStorage.getItem(Constants.ID_USUARIO);
      this.usuarioEntity.idUsuario = idUsuario;

      this.loginService.loginByIdService(this.usuarioEntity)
        .then((usuarioEntityResult: UsuarioEntity) => {
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
      subTitle: this.subTitleLogout,
      buttons: [
        {
          text: this.cancelLogout,
          role: 'cancel'
        },
        {
          text: this.sairLogout,
          handler: () => {
            // localStorage.removeItem(Constants.ID_USUARIO);
            this._storage.remove(Constants.ID_USUARIO);
            this._storage.remove(Constants.TOKEN_USUARIO);
            this._storage.remove(Constants.NOME_PESSOA);
            this._storage.remove(Constants.ID_VAGA_CANDIDATAR);

            // this.nativeStorage.remove(Constants.ID_USUARIO);
            // this.nativeStorage.remove(Constants.TOKEN_USUARIO);
            // this.nativeStorage.remove(Constants.NOME_PESSOA);
            // this.nativeStorage.remove(Constants.ID_VAGA_CANDIDATAR);
            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

  getFotoPerfil() {

    this._storage.get(Constants.CAMERA_DATA).then((cameraData) => {
      if(cameraData){
        this.cameraData = cameraData;
        this.photoTaken = true;
        this.photoSelected = false;
      } else {
        this._storage.get(Constants.CAMERA_URL).then((cameraUrl) => {
          if(cameraUrl){
            this.cameraUrl = cameraUrl;
            this.photoTaken = false;
            this.photoSelected = true;
            console.log('2');
          } else {
            this.photoTaken = false;
            this.photoSelected = false;
            console.log('3');
          }
        })
      }
    });



    // if (localStorage.getItem(Constants.CAMERA_DATA)!=null) {
    //   this.cameraData = localStorage.getItem(Constants.CAMERA_DATA);
    //   this.photoTaken = true;
    //   this.photoSelected = false;

    // console.log(this._idioma);
    //   console.log('1');

    // }else if (localStorage.getItem(Constants.CAMERA_URL)!=null){
    //     this.cameraUrl = localStorage.getItem(Constants.CAMERA_URL);
    //     this.photoTaken = false;
    //     this.photoSelected = true;
    //     console.log('2');

    // } else {
    //   this.photoTaken = false;
    //   this.photoSelected = false;
    //   console.log('3');
    // }
  }

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.loadingText = 'Aguarde...';
      this.subTitleLogout = 'Deseja realmente sair?';
      this.cancelLogout = 'FICAR';
      this.sairLogout = 'SAIR';
      this.vagas = 'Vagas';
      this.configuracoes = 'Configurações';
      this.candidaturas = 'Candidaturas';
      this.alterarFoto = 'Alterar foto';
      this.abrirCamera = 'Abrir câmera';
      this.abrirGaleria = 'Abrir galeria';
      this.cancelar = 'Cancelar';
    } else {
      this.loadingText = 'Wait...';
      this.subTitleLogout = 'Are you sure you want to log out?';
      this.cancelLogout = 'STAY';
      this.sairLogout = 'LOG OUT';
      this.vagas = 'Vacancies';
      this.configuracoes = 'Settings';
      this.candidaturas = 'Applications';
      this.alterarFoto = 'Change photo';
      this.abrirCamera = 'Open camera';
      this.abrirGaleria = 'Open Gallery';
      this.cancelar = 'Cancel';
    }
  }

}
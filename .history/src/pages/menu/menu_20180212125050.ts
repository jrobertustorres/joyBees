import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform, ActionSheetController } from 'ionic-angular';


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
  selectedLanguage = null;
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

  cameraData: string;
  photoTaken: boolean;
  // cameraUrl: string;
  cameraUrl: any;
  photoSelected: boolean;

  // trustedDashboardUrl : SafeUrl;

  // public base64Image: string;

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
              public actionSheetCtrl: ActionSheetController) {

      this.usuarioEntity = new UsuarioEntity();

      this.translate = translate;
      this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
      this.translate.use(this.selectedLanguage);

      if (localStorage.getItem(Constants.CAMERA_DATA)!=null) {
        this.cameraData = localStorage.getItem(Constants.CAMERA_DATA);
        this.photoTaken = true;
        this.photoSelected = false;
        console.log('1');

      }else if (localStorage.getItem(Constants.CAMERA_URL)!=null){
          this.cameraUrl = localStorage.getItem(Constants.CAMERA_URL);
          this.photoTaken = false;
          this.photoSelected = true;
          console.log('2');

      } else {
        this.photoTaken = false;
        this.photoSelected = false;
        console.log('3');
      }

      try {

        // this.rootPage = PrincipalPage;
        
        if(localStorage.getItem(Constants.ID_USUARIO)!=null) {
          this.callLoginByIdService();
        } else {
          this.rootPage = HomePage;
        }
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

  takePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Alterar foto',
      buttons: [
        {
          text: 'Abrir câmera',
          icon: !this.platform.is('ios') ? 'md-camera' : null,
          handler: () => {
            this.openCamera();
          }
        },{
          text: 'Abrir galeria',
          icon: !this.platform.is('ios') ? 'md-images' : null,
          handler: () => {
            this.selectFromGallery();
          }
        }
        ,{
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            // console.log('Cancel clicked');
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
      // this.cameraUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${imageData})`);
      localStorage.setItem(Constants.CAMERA_URL, this.cameraUrl);

      this.photoSelected = true;
      this.photoTaken = false;

      this.callCadastraImagemUsuario(this.cameraUrl);

      console.log(this.cameraUrl);
    }, (err) => {
      // Handle error
    });
  }

  // sanitize(url:string){
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  //   }
 
  openCamera() {
    var options = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    };
    this.camera.getPicture(options).then((imageData) => {
      this.cameraData = 'data:image/jpeg;base64,' + imageData;
      localStorage.setItem(Constants.CAMERA_DATA, this.cameraData);
      // if (localStorage.getItem(Constants.FOTO_USUAIRO)) {
      //   this.cameraData = localStorage.getItem(Constants.FOTO_USUAIRO);
      // } else {
      //   this.cameraUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${imageData})`);
      //   localStorage.setItem(Constants.FOTO_USUAIRO, this.cameraData);
      // }
      this.photoTaken = true;
      this.photoSelected = false;
      this.callCadastraImagemUsuario(this.cameraData);

      console.log(this.cameraData);
    }, (err) => {
      // Handle error
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
            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            // localStorage.removeItem(Constants.TIPO_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            localStorage.removeItem(Constants.ID_VAGA_CANDIDATAR);
            // localStorage.removeItem(Constants.TIPO_USUARIO_SELECIONADO);
            // localStorage.removeItem('idUsuarioLogado');

            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

  callLoginByIdService() {
    
      try {
        if (this.selectedLanguage == 'pt-br') {
          this.loadingText = 'Aguarde...';
        } else {
          this.loadingText = 'Wait...';
        }
        this.loading = this.loadingCtrl.create({
          content: this.loadingText
        });
        this.loading.present();
        let idUsuario: any;
        idUsuario = localStorage.getItem(Constants.ID_USUARIO);
        this.usuarioEntity.idUsuario = idUsuario;
        this.loginService.loginByIdService(this.usuarioEntity)
          .then((usuarioEntityResult: UsuarioEntity) => {
            let tokenUsuario: any;
            // let tipoUsuario: string;
            let nomePessoa: string;
  
            idUsuario = usuarioEntityResult.idUsuario;
            tokenUsuario = usuarioEntityResult.token;
            // tipoUsuario = usuarioEntityResult.tipoUsuario;
            nomePessoa = usuarioEntityResult.nomePessoa;
  
            localStorage.setItem(Constants.ID_USUARIO, idUsuario);
            localStorage.setItem(Constants.TOKEN_USUARIO, tokenUsuario);
            // localStorage.setItem(Constants.TIPO_USUARIO, tipoUsuario);
            localStorage.setItem(Constants.NOME_PESSOA, nomePessoa);
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

  getLanguage() {
    if (this.selectedLanguage == 'pt-br') {
      this.subTitleLogout = 'Deseja realmente sair?';
      this.cancelLogout = 'FICAR';
      this.sairLogout = 'SAIR';
      this.vagas = 'Vagas';
      this.configuracoes = 'Configurações';
      this.candidaturas = 'Candidaturas';
    } else {
      this.subTitleLogout = 'Are you sure you want to log out?';
      this.cancelLogout = 'STAY';
      this.sairLogout = 'LOG OUT';
      this.vagas = 'Vacancies';
      this.configuracoes = 'Settings';
      this.candidaturas = 'Applications';
    }
  }

}

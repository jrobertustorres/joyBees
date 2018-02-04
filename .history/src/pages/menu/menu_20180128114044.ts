import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Camera, CameraOptions } from '@ionic-native/camera';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';

//PAGES
import { HomePage } from '../home/home';
import { PrincipalPage } from '../principal/principal';
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

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
  private loadingText: string;
  private loading = null;

  // public base64Image: string;

  constructor(public navParams: NavParams,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private menuCtrl: MenuController,
              translate: TranslateService,
              private languageProvider: LanguageProvider,
              public loginService: LoginService,
              public usuarioService: UsuarioService,
              private camera: Camera) {

      this.usuarioEntity = new UsuarioEntity();

      this.translate = translate;
      this.selectedLanguage = localStorage.getItem("selectedLanguage") == null ? sysOptions.systemLanguage : localStorage.getItem("selectedLanguage");
      this.translate.use(this.selectedLanguage);

      // localStorage.removeItem(Constants.ID_USUARIO);
      console.log(this.selectedLanguage);

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

  selectFromGallery() {
    var options = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI
    };
    Camera.getPicture(options).then((imageData) => {
      this.cameraUrl = imageData;
      this.photoSelected = true;
      this.photoTaken = false;
    }, (err) => {
      // Handle error
    });
  }
 
  openCamera() {
    var options = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL
    };
    this.camera.getPicture(options).then((imageData) => {
      this.cameraData = 'data:image/jpeg;base64,' + imageData;
      this.photoTaken = true;
      this.photoSelected = false;
    }, (err) => {
      // Handle error
    });
  }

  // takePicture() {
  //   console.log('dentro');
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }
    
  //   this.camera.getPicture(options).then((imageData) => {
  //    // imageData is either a base64 encoded string or a file URI
  //    // If it's base64:
  //    console.log(imageData);
  //    let base64Image = 'data:image/jpeg;base64,' + imageData;

  //    console.log(base64Image);

  //   }, (err) => {
  //    // Handle error
  //   });
  // }

  constroiMenu() {

    this.languageProvider.languageChangeEvent.subscribe(selectedLanguage => {
      this.selectedLanguage = selectedLanguage;
      console.log(selectedLanguage);
      this.getLanguage(); // aqui temos a chamar novamente para funcionar a alteração da linguagem
      this.pages = [
        { title: 'Home', component: PrincipalPage, isVisible: true, icon: 'ios-list-box' },
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
      { title: 'Home', component: PrincipalPage, isVisible: true, icon: 'ios-list-box' },
      { title: this.configuracoes, component: ConfiguracoesPage, isVisible: true, icon: 'ios-settings' }
    ];

  }

  openPage(page) {
    this.nav.setRoot(page.component);
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
      this.configuracoes = 'Configurações';
    } else {
      this.subTitleLogout = 'Are you sure you want to log out?';
      this.cancelLogout = 'STAY';
      this.sairLogout = 'LOG OUT';
      this.configuracoes = 'Settings';
    }
  }

}
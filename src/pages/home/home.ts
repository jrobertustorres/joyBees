import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Constants } from '../../app/constants';
import { Facebook } from '@ionic-native/facebook';

//PAGES
import { LoginPage } from '../login/login';
import { MeusDadosPage } from '../meus-dados/meus-dados';
import { ModalTermosPage } from '../modal-termos/modal-termos';
import { PrincipalPage } from '../principal/principal';
import { DetalheVagaPage } from './../detalhe-vaga/detalhe-vaga';
import { VagasEmDestaquePage } from './../vagas-em-destaque/vagas-em-destaque';
import { NovoOrcamentoPage } from '../novo-orcamento/novo-orcamento';
import { ModalPoliticaPrivacidadePage } from '../modal-politica-privacidade/modal-politica-privacidade';

//SERVICES
import { LoginService } from '../../providers/login-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//ENTITYS
import { UsuarioEntity } from '../../model/usuario-entity';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  // FB_APP_ID: number = 210518629503681;
  segment: string = "vagasDestaque"; // default button
  private usuarioEntity: UsuarioEntity;

  // languages = availableLanguages;
  selectedLanguage: any;
  // private translate: TranslateService;
  // private _idioma: string;
  public loginPage: boolean;

  public languageDictionary: any;

  isLoggedIn: boolean = false;
  users: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private menu : MenuController,
              // translate: TranslateService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public fb: Facebook,
              private loginService: LoginService,
              private languageTranslateService: LanguageTranslateService,
              public modalCtrl: ModalController) {

    this.loginPage = navParams.get('loginPage');
    this.usuarioEntity = new UsuarioEntity();

    if(localStorage.getItem(Constants.ID_USUARIO)) {
      fb.getLoginStatus()
      .then(res => {
        if(res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
    }

    // this.fb.browserInit(this.FB_APP_ID, "v2.8");

  }

  ngOnInit() {
    this.getTraducao();
    if(this.loginPage == true) {
      this.segment = "login";
    }
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  getTraducao() {
    try {

      this.languageTranslateService
      .getTranslate()
      .subscribe(dados => {
        this.languageDictionary = dados;
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
  }

  goMeusDados() {
    this.navCtrl.push(MeusDadosPage);
  }

  goVagasEmDestaque() {
    this.navCtrl.push(VagasEmDestaquePage);
  }

  goFornecedoresEmDestaque() {
    this.navCtrl.push(NovoOrcamentoPage);
  }

  openModalTermos(){
    let modal = this.modalCtrl.create(ModalTermosPage);
    modal.present();
  }

  openModalPolitica(){
    let modal = this.modalCtrl.create(ModalPoliticaPrivacidadePage);
    modal.present();
  }

  //método para chamar api do facebook e salvar no banco o usuario
  // loginFacebook() {
  //   let permissions = new Array<string>();
  //   permissions = ["public_profile", "email"];

  //   this.facebook.login(permissions).then((response) => {
  //   let params = new Array<string>();

  //   this.facebook.api("/me?fields=name,email", params)
  //   .then(res => {

  //     this.usuarioEntity.idUsuarioFacebook = res.id;
  //     this.usuarioEntity.nomePessoa = res.name;
  //     this.usuarioEntity.genero = res.gender;
  //     this.usuarioEntity.imagemPessoaBs64 = res.picture;
  //     this.usuarioEntity.login = res.email;

  //     this.callLoginFacebook(this.usuarioEntity);
  //   }, (error) => {
  //     alert(error);
  //     console.log('ERRO LOGIN: ',error);
  //   })
  //   }, (error) => {
  //     alert(error);
  //   });
  // }

  doFbLogin(){
    // this.fb.login(['public_profile', 'user_friends', 'email'])
    this.fb.login(['public_profile', 'email'])
    .then(res => {
      if(res.status === "connected") {
        this.isLoggedIn = true;
        this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
  //   let permissions = new Array<string>();
  //   // let nav = this.navCtrl;
	//   let env = this;
  //   //the permissions your facebook app needs from the user
  //   permissions = ["public_profile"];
  //   this.usuarioEntity = new UsuarioEntity();

  //   this.fb.login(permissions)
  //   .then(function(response){
  //     let userId = response.authResponse.userID;
  //     let params = new Array<string>();

  //     //Getting name and gender properties
  //     env.fb.api("/me?fields=name,gender", params)
  //     .then(function(user) {
  //       user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
  //       //now we have the users info, let's save it in the NativeStorage
  //       // env._storage.set('userFacebook',
  //       // let envF = localStorage.setItem(Constants.DADOS_USUARIO_FACEBOOK)
  //       env._storage.set(Constants.DADOS_USUARIO_FACEBOOK,
  //       {
  //         userID: user.id,
  //         name: user.name,
  //         gender: user.gender,
  //         picture: user.picture,
  //         email: user.email
  //       })
  //       .then(function(){
  //         this.usuarioEntity.idUsuarioFacebook = user.id;
  //         this.usuarioEntity.nomePessoa = user.name;
  //         this.usuarioEntity.genero = user.gender;
  //         this.usuarioEntity.imagemPessoaBs64 = user.picture;
  //         this.usuarioEntity.login = user.email;

  //         this.callLoginFacebook(this.usuarioEntity);

  //       }, function (error) {
  //         console.log(error);
  //       })
  //     })
  //   }, function(error){
  //     console.log(error);
  //   });
  }

  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        this.users = res;
        this.usuarioEntity.idUsuarioFacebook = this.users.id;
        this.usuarioEntity.nomePessoa = this.users.name;
        this.usuarioEntity.genero = this.users.gender;
        //this.usuarioEntity.imagemPessoaBs64 = this.users.picture.data.url;
        this.usuarioEntity.login = this.users.email;

  //      console.log(JSON.stringify(this.usuarioEntity));
        //localStorage.setItem(Constants.CAMERA_DATA, this.users.picture.data.url); // TESTAR  <===================

      this.callLoginFacebook(this.usuarioEntity);
    })
    .catch(e => {
      console.log(e);
    });
  }

  callLoginFacebook(usuarioEntity) {
    this.loginService.loginFacebook(usuarioEntity)
    .then((usuarioEntityResult: UsuarioEntity) => {

      if(!localStorage.getItem(Constants.ID_VAGA_CANDIDATAR)){
        this.navCtrl.setRoot(PrincipalPage);
      }
      else if(localStorage.getItem(Constants.ID_VAGA_CANDIDATAR)) {
          this.navCtrl.setRoot(DetalheVagaPage, {idVaga: localStorage.getItem(Constants.ID_VAGA_CANDIDATAR)});
      }

      // this.loading.dismiss();
    }, (err) => {
      // this.loading.dismiss();
      this.alertCtrl.create({
        subTitle: err.message,
        buttons: ['OK']
      }).present();
    });
  }

}

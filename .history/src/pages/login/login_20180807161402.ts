import { Component, OnInit } from '@angular/core';
import { Constants } from '../../app/constants';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

//PAGE
import { PrincipalPage } from '../principal/principal';
import { DetalheVagaPage } from './../detalhe-vaga/detalhe-vaga';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';

//SERVICES
import { LoginService } from '../../providers/login-service';
import { LanguageTranslateService } from '../../providers/language-translate-service';

//I18N
// import { TranslateService } from '@ngx-translate/core';
// import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  // languages = availableLanguages;
  // selectedLanguage: any;
  // private translate: TranslateService;
  // private loadingText: string;
  // private _idioma: string;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              private loginService: LoginService, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              // translate: TranslateService,
              private languageTranslateService: LanguageTranslateService) {

    // this.translate = translate;
    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {
    this.getTraducao();
    this.loginForm 	= this.formBuilder.group({
      'login': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'senha': ['', Validators.required]
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
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  goRecuperarSenha() {
    this.navCtrl.push(RecuperarSenhaPage);
  }

  submeterLogin() {

    try {

      if (this.loginForm.valid) {

        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
          dismissOnPageChange: true
        });
        this.loading.present();

      this.loginService.login(this.loginForm.value)
        .then((usuarioEntityResult: UsuarioEntity) => {

          if(!localStorage.getItem(Constants.ID_VAGA_CANDIDATAR)){
            this.navCtrl.setRoot(PrincipalPage);
          }
          else if(localStorage.getItem(Constants.ID_VAGA_CANDIDATAR)) {
              this.navCtrl.setRoot(DetalheVagaPage, {idVaga: localStorage.getItem(Constants.ID_VAGA_CANDIDATAR)});
          }

          this.loading.dismiss();
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
      } else {
        Object.keys(this.loginForm.controls).forEach(campo => {
          const controle = this.loginForm.get(campo);
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

  // getLanguage() {
  //   this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
  //   this.selectedLanguage = localStorage.getItem(Constants.IDIOMA_USUARIO);
  //   // this._storage.get('selectedLanguage').then((selectedLanguage) => {
  //       if(!this.selectedLanguage){
  //         this.selectedLanguage = this._idioma;
  //       }
  //       else if(this.selectedLanguage) {
  //         this.selectedLanguage = this.selectedLanguage;
  //         if (this.selectedLanguage == 'pt-br') {
  //           this.loadingText = 'Aguarde...';
  //         } else {
  //           this.loadingText = 'Wait...';
  //         }
  //       }
  //       this.translate.use(this.selectedLanguage);

  //     // });

  // }

}

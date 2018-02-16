import { Component, OnInit } from '@angular/core';
import { Constants } from '../../app/constants';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { RecuperarSenhaPage } from '../recuperar-senha/recuperar-senha';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

import { Storage } from '@ionic/storage';

import { NativeStorage } from '@ionic-native/native-storage';

//PAGE
import { PrincipalPage } from '../principal/principal';
import { DetalheVagaPage } from './../detalhe-vaga/detalhe-vaga';

//ENTITY
import { UsuarioEntity } from '../../model/usuario-entity';

//PROVIDER
import { LoginService } from '../../providers/login-service';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  languages = availableLanguages;
  // selectedLanguage = sysOptions.systemLanguage;
  selectedLanguage: any;
  private translate: TranslateService;
  private loadingText: string;
  private _idioma: string;

  constructor(public navCtrl: NavController, 
              private loginService: LoginService, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              private nativeStorage: NativeStorage,
              private _storage: Storage,
              translate: TranslateService) {

    this.translate = translate;
    this._idioma = sysOptions.systemLanguage == 'pt-br' ? 'pt-br' : 'en';
    this.selectedLanguage = localStorage.getItem('selectedLanguage') == null ? this._idioma : localStorage.getItem('selectedLanguage');
    // console.log(this._idioma);
    // this.selectedLanguage = this.nativeStorage.getItem('selectedLanguage') == null ? this._idioma : this.nativeStorage.getItem('selectedLanguage');
    
    // console.log(this.selectedLanguage);
    
    this.translate.use(this.selectedLanguage);
    this.usuarioEntity = new UsuarioEntity();
  }

  ngOnInit() {
    this.loginForm 	= this.formBuilder.group({
      // 'login': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      'login': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      'senha': ['', Validators.required]
   });
  }

  ionViewDidLoad() {
  }

  goRecuperarSenha() {
    this.navCtrl.push(RecuperarSenhaPage);
  }

  teste() {
    this.navCtrl.setRoot(PrincipalPage);
  }

  submeterLogin() {
    // if (this.nativeStorage.getItem(Constants.ID_VAGA_CANDIDATAR)) {
    //   this.navCtrl.setRoot(DetalheVagaPage, {idVaga: this.nativeStorage.getItem(Constants.ID_VAGA_CANDIDATAR)});
    // } else {
    //   this.navCtrl.setRoot(PrincipalPage);
    // }

    try {

      if (this.loginForm.valid) {

        if (this.selectedLanguage == 'pt-br') {
          this.loadingText = 'Aguarde...';
        } else {
          this.loadingText = 'Wait...';
        }
        this.loading = this.loadingCtrl.create({
          content: this.loadingText
        });
        this.loading.present();

      this.loginService.login(this.loginForm.value)
        .then((usuarioEntityResult: UsuarioEntity) => {

          // let idUsuario: any;
          // let tokenUsuario: any;
          // let nomePessoa: string;

          // idUsuario = usuarioEntityResult.idUsuario;
          // tokenUsuario = usuarioEntityResult.token;
          // nomePessoa = usuarioEntityResult.nomePessoa;

          // this._storage.set(Constants.ID_USUARIO, idUsuario);
          // this._storage.set(Constants.TOKEN_USUARIO, tokenUsuario);
          // this._storage.set(Constants.NOME_PESSOA, nomePessoa);

          this._storage.get(Constants.ID_VAGA_CANDIDATAR).then((candidatado) => {
            console.log('Is candidatado : ', candidatado);
            if(!candidatado){
              console.log('3333333333333333333 ');
              this.navCtrl.setRoot(PrincipalPage);
            }
            else if(candidatado) {
                this.navCtrl.setRoot(DetalheVagaPage, {idVaga: this.nativeStorage.getItem(Constants.ID_VAGA_CANDIDATAR)});
            }
          });

          // localStorage.setItem(Constants.ID_USUARIO, idUsuario);
          // localStorage.setItem(Constants.TOKEN_USUARIO, tokenUsuario);
          // localStorage.setItem(Constants.NOME_PESSOA, nomePessoa);

          // if (localStorage.getItem(Constants.ID_VAGA_CANDIDATAR)) {
          //   this.navCtrl.setRoot(DetalheVagaPage, {idVaga: this.nativeStorage.getItem(Constants.ID_VAGA_CANDIDATAR)});
          // } else {
          //   this.navCtrl.setRoot(PrincipalPage);
          // }
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

}

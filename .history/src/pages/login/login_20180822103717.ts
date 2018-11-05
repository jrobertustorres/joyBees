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

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  private usuarioEntity: UsuarioEntity;
  private loading = null;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              private loginService: LoginService, 
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder,
              private languageTranslateService: LanguageTranslateService) {

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
          err.message = err.message ? err.message : this.languageDictionary.LABEL_FALHA_CONEXAO_SERVIDOR;
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

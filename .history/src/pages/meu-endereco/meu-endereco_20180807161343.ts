import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../app/constants';

// SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { UsuarioService } from '../../providers/usuario-service';

//ENTITYS
import { EnderecoEntity } from './../../model/endereco-entity';

//PAGES
import { ConfiguracoesPage } from '../configuracoes/configuracoes';

@IonicPage()
@Component({
  selector: 'page-meu-endereco',
  templateUrl: 'meu-endereco.html',
})
export class MeuEnderecoPage {
  public enderecoUsuarioForm: FormGroup;
  private enderecoEntity: EnderecoEntity;
  private estados = [];
  private cidades = [];
  public languageDictionary: any;
  private loading = null;
  private isCadastroCompletoVaga: any;
  private isCadastroCompletoServico: any;

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              private estadosService: EstadosService, 
              private cidadesService: CidadesService,
              private usuarioService: UsuarioService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.enderecoEntity = new EnderecoEntity();
  }

  ngOnInit() {

    this.getTraducao();

    this.enderecoUsuarioForm = this.formBuilder.group({
      'endereco': ['', [Validators.required, Validators.maxLength(300)]],
      'cep': ['', Validators.required],
      'nomeResidencia': [''],
      'idEstado': ['', Validators.required],
      'idCidade': ['', Validators.required],
    });

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
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
        this.getEnderecoUsuario();
      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: this.languageDictionary.TOAST_ENDERECO_ATUALIZADO,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  getEnderecoUsuario() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT,
        dismissOnPageChange: true
      });
      this.loading.present();

      this.usuarioService.findEndereco()
      .then((enderecoEntityResult: EnderecoEntity) => {
        this.enderecoEntity = enderecoEntityResult;

        this.getCidadesByEstadoUsuario(this.enderecoEntity.idEstado);

        // this.loading.dismiss();
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

  submeterEnderecoUsuario() {
    try {
      if (this.enderecoUsuarioForm.valid) {
        this.loading = this.loadingCtrl.create({
          content: this.languageDictionary.LOADING_TEXT,
          dismissOnPageChange: true
        });
        this.loading.present();
        // AQUI USAMOS SEMPRE O ALTERA POIS NO SERVIDOR MESMO NA HORA DE INSERIR O MÉTODO É O MESMO DE ALTERAR
        this.usuarioService
        .alteraEndereco(this.enderecoEntity)
        .then((enderecoEntityResult: EnderecoEntity) => {

        this.isCadastroCompletoVaga = enderecoEntityResult.isCadastroCompletoVaga;
        localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_VAGA, this.isCadastroCompletoVaga);
        this.isCadastroCompletoServico = enderecoEntityResult.isCadastroCompletoServico;
        localStorage.setItem(Constants.IS_CADASTRO_COMPLETO_SERVICO, this.isCadastroCompletoServico);

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
      } else {
        Object.keys(this.enderecoUsuarioForm.controls).forEach(campo => {
          const controle = this.enderecoUsuarioForm.get(campo);
          controle.markAsTouched();
        })
      }
    }catch (err){
      if(err instanceof RangeError){
      }
      console.log(err);
    }

  }

  getCidadesByEstadoUsuario(idEstado) {
    try {
      // this.loading = this.loadingCtrl.create({
      //   content: this.languageDictionary.LOADING_TEXT
      // });
      // this.loading.present();

      this.cidadesService
        .getCidades(idEstado)
        .then((listCidadesResult) => {
          this.cidades = listCidadesResult;
          this.loading.dismiss();
        })
        .catch(err => {
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

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

// SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';

@IonicPage()
@Component({
  selector: 'page-meu-endereco',
  templateUrl: 'meu-endereco.html',
})
export class MeuEnderecoPage {
  public enderecoUsuarioForm: FormGroup;
  private estados = [];
  private cidades = [];
  public languageDictionary: any;
  private loading = null;

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              private estadosService: EstadosService, 
              private cidadesService: CidadesService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
  }

  ngOnInit() {

    this.getTraducao();

    this.enderecoUsuarioForm = this.formBuilder.group({
      'endereco': ['', [Validators.required, Validators.maxLength(300)]],
      'cep': ['', Validators.required],
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

  getEnderecoUsuario() {
    try {
      this.loading = this.loadingCtrl.create({
        content: this.languageDictionary.LOADING_TEXT
      });
      this.loading.present();

      this.usuarioService
        .getDadosUsuario()
        .then((dadosUsuarioDetalheResult) => {
          this.usuarioDetalheEntity = dadosUsuarioDetalheResult;

          // this.loading.dismiss();
          this.getCidadesByEstadoUsuario(dadosUsuarioDetalheResult.idEstado);
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

  getCidadesByEstadoUsuario(idEstado) {
    try {

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

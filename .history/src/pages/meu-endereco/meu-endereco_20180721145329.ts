import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

// SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';
import { UsuarioService } from '../../providers/usuario-service';

//ENTITYS
import { EnderecoEntity } from './../../model/endereco-entity';

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

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              private estadosService: EstadosService, 
              private cidadesService: CidadesService,
              private usuarioService: UsuarioService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private languageTranslateService: LanguageTranslateService,
              public navParams: NavParams) {
    this.enderecoEntity = new EnderecoEntity();
  }

  ngOnInit() {

    this.getTraducao();

    this.enderecoUsuarioForm = this.formBuilder.group({
      'endereco': ['', [Validators.required, Validators.maxLength(300)]],
      'cep': ['', Validators.required],
      'nomeResidencia': ['', Validators.required],
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

      this.usuarioService.findEndereco()
      .then((enderecoEntityResult: EnderecoEntity) => {
        this.enderecoEntity = enderecoEntityResult;

        console.log(this.enderecoEntity);
        this.getCidadesByEstadoUsuario(this.enderecoEntity.idEstado);

        this.loading.dismiss();
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

  // getEnderecoUsuario() {
  //   try {
  //     this.loading = this.loadingCtrl.create({
  //       content: this.languageDictionary.LOADING_TEXT
  //     });
  //     this.loading.present();

  //     this.usuarioService
  //       .findEndereco()
  //       .then((enderecoEntityResult) => {
  //         this.enderecoEntity = enderecoEntityResult;

  //         // this.loading.dismiss();
  //         this.getCidadesByEstadoUsuario(enderecoEntityResult.idEstado);
  //       })
  //       .catch(err => {
  //         this.loading.dismiss();
  //         this.alertCtrl.create({
  //           subTitle: err.message,
  //           buttons: ['OK']
  //         }).present();
  //       });
  //   }catch (err){
  //     if(err instanceof RangeError){
  //     }
  //     console.log(err);
  //   }
  // }

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

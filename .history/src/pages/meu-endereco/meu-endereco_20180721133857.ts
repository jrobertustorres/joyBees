import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, 
              private formBuilder: FormBuilder,
              public navParams: NavParams) {
  }

  ngOnInit() {

    this.getTraducao();

    this.enderecoUsuarioForm = this.formBuilder.group({
      'endereco': ['', [Validators.required, Validators.maxLength(300)]],
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

      });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-meus-dados',
  templateUrl: 'meus-dados.html',
})
export class MeusDadosPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    
        this.dadosUsuarioForm = this.formBuilder.group({
          'nomePessoa': ['', [Validators.required, Validators.maxLength(100)]],
          'loginUsuario': ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
          'endereco': ['', [Validators.required, Validators.maxLength(300)]],
          'telefonePessoa': ['', Validators.maxLength(50)],
          'idEstado': ['', Validators.required],
          'idCidade': ['', Validators.required],
          'senhaUsuario': [''],
          'confirmSenha': ['']
          // 'statusAceitoTermoUso': ['false']
        }, 
        // {
        //     validator: PasswordValidation.MatchPassword // your validation method
        //   }
        );
    
      //  localStorage.removeItem(Constants.ID_USUARIO);
    
        // this.isReadOnly = localStorage.getItem(Constants.ID_USUARIO) ? true : false;
        // if (localStorage.getItem(Constants.ID_USUARIO)) {
        //   this.getDadosUsuario();
        // } else {
        //   this.dadosUsuarioForm.get('senhaUsuario').setValidators([Validators.required]);
        // }
    
        // this.estadosBrService
        //   .getEstadosBr()
        //   .subscribe(dados => {
        //   this.estados = dados;
        // });
    
      }

  ionViewDidLoad() {
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';

//SERVICES
import { LanguageTranslateService } from '../../providers/language-translate-service';

@IonicPage()
@Component({
  selector: 'page-modal-informacoes-por-sevico',
  templateUrl: 'modal-informacoes-por-sevico.html',
})
export class ModalInformacoesPorSevicoPage {
  private idServico: number;
  public lancarOrcamentoForm: FormGroup;
  public dataSolicitacao: string;
  public languageDictionary: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private datePicker: DatePicker,
              private languageTranslateService: LanguageTranslateService,
              public viewCtrl: ViewController) {
    this.idServico = navParams.get('idServico');
  }

  ngOnInit() {
    this.lancarOrcamentoForm = this.formBuilder.group({
      'dataSolicitacao': ['', Validators.required],
      'descricao': ['', Validators.maxLength(100), Validators.required],
      'quantidade': ['', Validators.maxLength(100), Validators.required],
    }
    );
    this.lancarOrcamentoForm.controls.dataSolicitacao.disable();
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  selecionaDataSolicitacao() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      okText: 'OK',
      cancelText: this.languageDictionary.CANCELAR,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    })
    .then(dataSolicitacao => {
      this.dataSolicitacao = dataSolicitacao.toISOString();
    }, (err) => {
      console.log('Error occurred while getting date: ', err);
      console.log('---------------------------------------- ', err);
    });
  }

}
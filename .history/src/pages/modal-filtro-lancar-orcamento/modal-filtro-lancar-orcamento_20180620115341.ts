import { Component } from '@angular/core';
import { FormBuilder,	FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';

// SERVICES
import { EstadosService } from '../../providers/estados-service';
import { CidadesService } from '../../providers/cidades-service';

@IonicPage()
@Component({
  selector: 'page-modal-filtro-lancar-orcamento',
  templateUrl: 'modal-filtro-lancar-orcamento.html',
})
export class ModalFiltroLancarOrcamentoPage {
  public filtroForm: FormGroup;
  private estados = [];
  private cidades = [];
  public loading = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private estadosService: EstadosService,
              private cidadesService: CidadesService,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private formBuilder: FormBuilder,
              public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.filtroForm = this.formBuilder.group({
      'idEstado': ['', Validators.required],
      'idCidade': [''],
    });

    this.estadosService
      .getEstados()
      .subscribe(dados => {
      this.estados = dados;
    });
  }

  ionViewDidLoad() {
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getCidadesByEstado(idEstado) {
    try {

      this.loading = this.loadingCtrl.create({
        content: this.loading
      });
      this.loading.present();

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

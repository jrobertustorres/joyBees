import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//SERVICES
import { ServicoService } from './../../providers/servico-service';

//ENTITYS
import { ServicoMapEntity } from '../../model/servico-map-entity';

@IonicPage()
@Component({
  selector: 'page-novo-orcamento',
  templateUrl: 'novo-orcamento.html',
})
export class NovoOrcamentoPage {
  public loading = null;
  private servicoMapEntity: ServicoMapEntity;
  private listServicos: any;
  private listServicoResposta: any[] = [];

  // listServicoResposta: Array<ServicoMapEntity[]>;
  // listServicoResposta : Map<string, ServicoMapEntity[]>

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
    this.servicoMapEntity = new ServicoMapEntity();
  }

  ngOnInit() {
    this.getMapServico();
  }

  ionViewDidLoad() {
  }

  loadMore(infiniteScroll) {

    setTimeout(() => {

      this.getMapServico();
      infiniteScroll.complete();
    }, 500);
  }

  getMapServico() {
    try {
      this.servicoMapEntity.limitDados = this.servicoMapEntity.limitDados ? this.listServicos.length : null;

      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();
      this.servicoService.findMapServico(this.servicoMapEntity)
        .then((servicoMapEntityResult: ServicoMapEntity) => {
          this.listServicos = servicoMapEntityResult;
          this.servicoMapEntity.limitDados = this.listServicos.length;

          this.listServicos = {
            "mapServicos":    {
               "0":       [
                           {
                     "idServico": 2,
                     "idTipoServico": 1,
                     "tipoServico": "AlimentaÃ§Ã£o",
                     "servico": "Mini pizzas ",
                     "descricao": "Mini pizzas para evenos",
                     "status": true,
                     "limitDados": null
                  },
                           {
                     "idServico": 1,
                     "idTipoServico": 1,
                     "tipoServico": "AlimentaÃ§Ã£o",
                     "servico": "Salgados",
                     "descricao": "Salgados de festa",
                     "status": true,
                     "limitDados": null
                  }
               ],
               "1":       [
                           {
                     "idServico": 4,
                     "idTipoServico": 2,
                     "tipoServico": "Local",
                     "servico": "Area aberta",
                     "descricao": "Area aberta para eventos",
                     "status": true,
                     "limitDados": null
                  },
                           {
                     "idServico": 3,
                     "idTipoServico": 2,
                     "tipoServico": "Local",
                     "servico": "SalÃ£o de festa",
                     "descricao": "SalÃ£o de festa grande",
                     "status": true,
                     "limitDados": null
                  }
               ]
            },
            "limitDados": 100
         };
          
          // this.listServicoResposta = this.listServicos.mapServicos;
        console.log(this.listServicos);
        console.log(this.listServicos.mapServicos[0]);
        // console.log(this.listServicoResposta);
        this.listServicoResposta.push(this.listServicos.mapServicos);
        console.log(this.listServicoResposta);

              // for (let value of this.listServicoResposta[0]) {
              //     console.log(value);
              // }
              for (let i = 0; i < this.listServicoResposta.length; i++) { 
                // text += cars[i] + "<br>";
                console.log(this.listServicoResposta[i]);
                console.log('aaaaaaaaaaaa');
                // this.listServicoResposta = this.listServicoResposta[i];
              }
                // console.log(this.listServicoResposta);
                // console.log(this.listServicoResposta[0]);
          

          this.loading.dismiss();
        }, (err) => {
          this.loading.dismiss();
          this.alertCtrl.create({
            subTitle: err.message,
            buttons: ['OK']
          }).present();
        });
    }
    catch (err){
      if(err instanceof RangeError){
        console.log('out of range');
      }
      console.log(err);
    }
  }

  toggleSection(i) {
    this.listServicoResposta[i].open = !this.listServicoResposta[i].open;
  }

}

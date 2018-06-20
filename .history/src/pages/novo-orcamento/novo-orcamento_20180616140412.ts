import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

//SERVICES
import { ServicoService } from './../../providers/servico-service';

//ENTITYS
import { ServicoListEntity } from '../../model/servico-list-entity';

@IonicPage()
@Component({
  selector: 'page-novo-orcamento',
  templateUrl: 'novo-orcamento.html',
})
export class NovoOrcamentoPage {
  public loading = null;
  private servicoListEntity: ServicoListEntity;
  private listaServicos: any;
  private listServicoResposta: any;
  private listServicoRespostaChild: any[] = [];
  private servicosSelecionados: any[] = [];
  private auxIndex = null;
  public serviceChecked = false;
  public contador: number;

  constructor(public navCtrl: NavController, 
              public loadingCtrl: LoadingController,
              private servicoService: ServicoService,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
    this.servicoListEntity = new ServicoListEntity();
  }

  ngOnInit() {
    this.contador = 0;
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
      this.servicoListEntity.limitDados = this.servicoListEntity.limitDados ? this.listaServicos.length : null;

      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();
      this.servicoService.findMapServico(this.servicoListEntity)
        .then((servicoListEntityResult: ServicoListEntity) => {
          this.listaServicos = servicoListEntityResult;
          this.servicoListEntity.limitDados = this.listaServicos.length;

          this.listServicoResposta = servicoListEntityResult;

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
    
    if(this.auxIndex == i || this.auxIndex == null) {
      this.auxIndex = i;
    }
    
    if(this.auxIndex!=i) {
      this.listServicoResposta[this.auxIndex].open = false;
      this.auxIndex = i;
    }

    this.listServicoRespostaChild = this.listServicoResposta[i].listServicos;
    this.listServicoResposta[i].open = !this.listServicoResposta[i].open;
    
    for(let i=0; i < this.listServicoRespostaChild.length; i++) {
      this.listServicoRespostaChild[i].serviceChecked = false;
      for(let j=0; j < this.servicosSelecionados.length; j++) {
        if (this.listServicoRespostaChild[i].idServico == this.servicosSelecionados[j]) {
          this.listServicoRespostaChild[i].serviceChecked = true;
        } 
      }
    }    
      
  }

  servicosChecked(idServico) {
    let index = this.servicosSelecionados.indexOf(idServico);
    // this.contador = 0;
    // console.log(this.servicosSelecionados.length);
    for(let j=1; j < this.servicosSelecionados.length; j++) {
      this.contador = this.contador +1;
      this.listServicoResposta[j].contador = this.contador;
      console.log(this.listServicoResposta[j]);
      console.log(this.listServicoResposta[j].contador);
      // this.contador = this.servicosSelecionados[j];
    }

    // this.listServicoRespostaChild[index].contador = this.contador +1;
    // this.listServicoResposta[index].contador = this.listServicoRespostaChild[index].contador;
    // console.log('aaaaaaaaaaa');
    // console.log(this.listServicoResposta[index].contador);

          // this.contador = this.contador +1;
    if (index != -1) {
      this.servicosSelecionados.splice(index, 1);
      // console.log(index);
      // this.contador = this.contador == 0 ? this.contador : this.contador-1;
    } else {
      // this.contador = this.contador +1;
      // console.log(idServico);
      this.servicosSelecionados.push(idServico);
    }
  }

  verificaServicosSelecionados() {
    if(this.servicosSelecionados.length > 0) {
      // aqui chamar o serviço para inserir
    } else {
      this.showAlert();
    }

  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Falha ao lançar!',
      subTitle: 'Por favor, selecione algum serviço!',
      buttons: ['OK']
    });
    alert.present();
  }

}

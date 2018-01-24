import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';
import { Constants } from '../../app/constants';

//PAGES
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit{
  @ViewChild('content') nav: Nav;
  rootPage:any;
  pages: Array<{title: string, component: any, isVisible: boolean, icon: string}>;

  constructor(public navParams: NavParams,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  logout() {
    let alert = this.alertCtrl.create({
      subTitle: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel'
        },
        {
          text: 'QUERO SAIR',
          handler: () => {
            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            // localStorage.removeItem(Constants.TIPO_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            // localStorage.removeItem(Constants.TIPO_USUARIO_SELECIONADO);
            // localStorage.removeItem('idUsuarioLogado');

            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

}

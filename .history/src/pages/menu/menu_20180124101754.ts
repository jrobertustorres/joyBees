import { Component } from '@angular/core';
import { IonicPage, AlertController, Nav, MenuController, NavParams, LoadingController } from 'ionic-angular';

//PAGES
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  logout() {
    let alert = this.alertCtrl.create({
      subTitle: this.subTitleLogout,
      buttons: [
        {
          text: this.cancelLogout,
          role: 'cancel'
        },
        {
          text: this.sairLogout,
          handler: () => {
            localStorage.removeItem(Constants.ID_USUARIO);
            localStorage.removeItem(Constants.TOKEN_USUARIO);
            localStorage.removeItem(Constants.TIPO_USUARIO);
            localStorage.removeItem(Constants.NOME_PESSOA);
            localStorage.removeItem(Constants.TIPO_USUARIO_SELECIONADO);
            localStorage.removeItem('idUsuarioLogado');

            this.nav.setRoot(HomePage);
            this.menuCtrl.close();
          }
        }
      ]
    });
    alert.present();
  }

}

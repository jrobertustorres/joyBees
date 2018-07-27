import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//I18N
import { TranslateService } from '@ngx-translate/core';
import { availableLanguages, sysOptions } from '../i18n/i18n-constants';

//PAGES
import { HomePage } from './../home/home';

@IonicPage()
@Component({
  selector: 'page-fornecedores-em-destaque',
  templateUrl: 'fornecedores-em-destaque.html',
})
export class FornecedoresEmDestaquePage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  openLoginPage() {
    this.navCtrl.push(HomePage, {loginPage: true});
  }

}

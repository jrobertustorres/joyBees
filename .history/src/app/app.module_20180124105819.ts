import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//PAGES
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { MeusDadosPage } from '../pages/meus-dados/meus-dados';
import { PrincipalPage } from '../pages/principal/principal';
import { MenuPage } from '../pages/menu/menu';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { ModalPoliticaPrivacidadePage } from '../pages/modal-politica-privacidade/modal-politica-privacidade';
import { ModalTermosPage } from '../pages/modal-termos/modal-termos';
import { MinhaSenhaPage } from '../pages/minha-senha/minha-senha';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    MeusDadosPage,
    PrincipalPage,
    MenuPage,
    ConfiguracoesPage,
    ModalPoliticaPrivacidadePage,
    ModalTermosPage,
    MinhaSenhaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    MeusDadosPage,
    PrincipalPage,
    MenuPage,
    ConfiguracoesPage,
    ModalPoliticaPrivacidadePage,
    ModalTermosPage,
    MinhaSenhaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

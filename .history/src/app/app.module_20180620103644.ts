import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { EmailComposer } from '@ionic-native/email-composer';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';

//PROVIDERS
import { LanguageProvider } from '../providers/language-provider';

//TRANSLATE
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Globalization } from '@ionic-native/globalization';

//PAGES
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
import { RecuperarSenhaPage } from '../pages/recuperar-senha/recuperar-senha';
import { DetalheVagaPage } from '../pages/detalhe-vaga/detalhe-vaga';
import { VagasCandidatadasPage } from '../pages/vagas-candidatadas/vagas-candidatadas';
import { ModalFiltroPage } from '../pages/modal-filtro/modal-filtro';
import { VagasEmDestaquePage } from '../pages/vagas-em-destaque/vagas-em-destaque';
import { FornecedoresEmDestaquePage } from '../pages/fornecedores-em-destaque/fornecedores-em-destaque';
import { OrcamentoPrincipalPage } from '../pages/orcamento-principal/orcamento-principal';
import { NovoOrcamentoPage } from '../pages/novo-orcamento/novo-orcamento';
import { OrcamentosListByStatusPage } from '../pages/orcamentos-list-by-status/orcamentos-list-by-status';
import { DetalheCotacaoPage } from '../pages/detalhe-cotacao/detalhe-cotacao';
import { ModalInformacoesPorSevicoPage } from '../pages/modal-informacoes-por-sevico/modal-informacoes-por-sevico';
import { ModalFiltroLancarOrcamentoPage } from '../pages/modal-filtro-lancar-orcamento/modal-filtro-lancar-orcamento';

//ENTITYS
import { UsuarioDetalheEntity } from '../model/usuario-detalhe-entity';
import { CidadeEntity } from '../model/cidade-entity';
import { VagaListaEntity } from '../model/vaga-lista-entity';
import { VagaDetalheEntity } from '../model/vaga-detalhe-entity';
import { ServicoEntity } from '../model/servico-entity';
import { ServicoListEntity } from '../model/servico-list-entity';
import { TipoServicoEntity } from '../model/tipo-servico-entity';
import { OrcamentoEntity } from '../model/orcamento-entity';
import { ServicoOrcamentoEntity } from '../model/servico-orcamento-entity';
import { CotacaoEntity } from '../model/cotacao-entity';
import { DetalheServicoOrcamentoEntity } from '../model/detalhe-servico-orcamento-entity';
import { DetalheOrcamentoEntity } from '../model/detalhe-orcamento-entity';
import { CockpitCotacaoEntity } from '../model/cockpit-cotacao-entity';

//SERVICES
import { EstadosService } from '../providers/estados-service';
import { CidadesService } from '../providers/cidades-service';
import { UsuarioService } from '../providers/usuario-service';
import { LoginService } from '../providers/login-service';
import { VagaService } from '../providers/vaga-service';
import { LanguageTranslateService } from '../providers/language-translate-service';
import { TipoServicoService } from '../providers/tipo-servico-service';
import { ServicoService } from '../providers/servico-service';
import { OrcamentoService } from '../providers/orcamento-service';

import { HttpClientModule, HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

function provideStorage() {
  return new Storage({ 
    name: 'joybees',
    storeName: 'usuario'
  });
}

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
    MinhaSenhaPage,
    RecuperarSenhaPage,
    DetalheVagaPage,
    VagasCandidatadasPage,
    ModalFiltroPage,
    VagasEmDestaquePage,
    FornecedoresEmDestaquePage,
    OrcamentoPrincipalPage,
    NovoOrcamentoPage,
    OrcamentosListByStatusPage,
    DetalheCotacaoPage,
    ModalInformacoesPorSevicoPage,
    ModalFiltroLancarOrcamentoPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    // IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
    },
  )
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
    MinhaSenhaPage,
    RecuperarSenhaPage,
    DetalheVagaPage,
    VagasCandidatadasPage,
    ModalFiltroPage,
    VagasEmDestaquePage,
    FornecedoresEmDestaquePage,
    OrcamentoPrincipalPage,
    NovoOrcamentoPage,
    OrcamentosListByStatusPage,
    DetalheCotacaoPage,
    ModalInformacoesPorSevicoPage,
    ModalFiltroLancarOrcamentoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SocialSharing,
    EmailComposer,
    AppVersion,
    Device,
    Globalization,
    LanguageProvider,
    EstadosService,
    CidadesService,
    UsuarioService,
    TipoServicoService,
    OrcamentoService,
    ServicoService,
    LoginService,
    VagaService,
    LanguageTranslateService,
    UsuarioDetalheEntity,
    CidadeEntity,
    Network,
    Camera,
    VagaListaEntity,
    VagaDetalheEntity,
    Facebook,
    ServicoEntity,
    ServicoListEntity,
    TipoServicoEntity,
    OrcamentoEntity,
    ServicoOrcamentoEntity,
    CotacaoEntity,
    DetalheServicoOrcamentoEntity,
    DetalheOrcamentoEntity,
    CockpitCotacaoEntity,
    Push,
    {provide: Storage, useFactory: provideStorage}
  ]
})
export class AppModule {}

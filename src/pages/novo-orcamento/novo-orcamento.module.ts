import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovoOrcamentoPage } from './novo-orcamento';

@NgModule({
  declarations: [
    NovoOrcamentoPage,
  ],
  imports: [
    IonicPageModule.forChild(NovoOrcamentoPage),
  ],
})
export class NovoOrcamentoPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheVagaPage } from './detalhe-vaga';

@NgModule({
  declarations: [
    DetalheVagaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheVagaPage),
  ],
})
export class DetalheVagaPageModule {}

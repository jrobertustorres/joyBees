import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheCotacaoPage } from './detalhe-cotacao';

@NgModule({
  declarations: [
    DetalheCotacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheCotacaoPage),
  ],
})
export class DetalheCotacaoPageModule {}

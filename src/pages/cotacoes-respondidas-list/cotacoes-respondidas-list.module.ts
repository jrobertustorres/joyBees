import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CotacoesRespondidasListPage } from './cotacoes-respondidas-list';

@NgModule({
  declarations: [
    CotacoesRespondidasListPage,
  ],
  imports: [
    IonicPageModule.forChild(CotacoesRespondidasListPage),
  ],
})
export class CotacoesRespondidasListPageModule {}

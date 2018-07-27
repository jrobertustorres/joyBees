import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CotacoesListByStatusPage } from './cotacoes-list-by-status';

@NgModule({
  declarations: [
    CotacoesListByStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(CotacoesListByStatusPage),
  ],
})
export class CotacoesListByStatusPageModule {}

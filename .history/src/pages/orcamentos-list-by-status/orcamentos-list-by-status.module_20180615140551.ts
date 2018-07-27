import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrcamentosListByStatusPage } from './orcamentos-list-by-status';

@NgModule({
  declarations: [
    CotacoesListByStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(CotacoesListByStatusPage),
  ],
})
export class CotacoesListByStatusPageModule {}

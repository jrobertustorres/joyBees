import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrcamentoPrincipalPage } from './orcamento-principal';

@NgModule({
  declarations: [
    OrcamentoPrincipalPage,
  ],
  imports: [
    IonicPageModule.forChild(OrcamentoPrincipalPage),
  ],
})
export class OrcamentoPrincipalPageModule {}

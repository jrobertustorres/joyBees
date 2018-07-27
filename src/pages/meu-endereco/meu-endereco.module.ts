import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeuEnderecoPage } from './meu-endereco';

@NgModule({
  declarations: [
    MeuEnderecoPage,
  ],
  imports: [
    IonicPageModule.forChild(MeuEnderecoPage),
  ],
})
export class MeuEnderecoPageModule {}

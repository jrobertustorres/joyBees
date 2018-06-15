import { ServicoEntity } from '../model/servico-entity';
export class ServicoMapEntity {
    
  public limitDados: number;
  public mapServicos : Map<string, ServicoEntity[]>;

  constructor(){
  }

}
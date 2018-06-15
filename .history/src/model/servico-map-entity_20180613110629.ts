import { ServicoEntity } from '../model/servico-entity';
export class ServicoMapEntity {
    
  public tipoServico: string;
  public limitDados: number;
  public mapServicos : Map<string, ServicoEntity[]>;

  constructor(){
  }

}
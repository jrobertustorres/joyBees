import { ServicoEntity } from '../model/servico-entity';
export class ServicoMapEntity {
    
      public limitDados: number;
      public mapServicos : Map<string, ServicoEntity[]>;
      // public listDetalheServicoOrcamentoEntity: ServicoEntity[] = [];

      // private Map<String, List<ServicoEntity>> mapServicos;

      constructor(){
      }
    
    }
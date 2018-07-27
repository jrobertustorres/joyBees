import { ServicoOrcamentoEntity } from '../model/servico-orcamento-entity';
import { FiltroEntity } from '../model/filtro-entity';
export class OrcamentoEntity {

  public idCotacao: number;
  public idOrcamento: number;
  public idOrcamentoFormat: string;
  public descricao: string;
  public dataOrcamento: string;
  public statusOrcamentoEnum: string;

  public listServicoOrcamento: ServicoOrcamentoEntity[] = [];
  
  public filtroEntity: FiltroEntity;

  public limitDados: number;

  constructor(){
  }
}

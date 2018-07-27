import { ServicoOrcamentoEntity } from '../model/servico-orcamento-entity';
export class OrcamentoEntity {

  public idCotacao: number;
  public idOrcamento: number;
  public idOrcamentoFormat: string;
  public descricao: string;
  public dataOrcamento: string;
  public statusOrcamentoEnum: string;
  public dataSolicitacao: Date;

  public listServicoOrcamento: ServicoOrcamentoEntity[] = [];
  public listIdFornecedor: number[];

  constructor(){
  }
}

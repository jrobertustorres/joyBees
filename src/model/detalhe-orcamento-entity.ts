import { DetalheServicoOrcamentoEntity } from '../model/detalhe-servico-orcamento-entity';
export class DetalheOrcamentoEntity {

  public idOrcamento: number;
  public descricao: string;
  public dataOrcamento: string;
  public statusOrcamentoEnum: string;

  public listDetalheServicoOrcamentoEntity: DetalheServicoOrcamentoEntity[] = [];

  constructor(){
  }
}

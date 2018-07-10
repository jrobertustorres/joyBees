import { ServicoOrcamentoEntity } from '../model/servico-orcamento-entity';
export class OrcamentoEntity {

  public idCotacao: number;
  public idOrcamento: number;
  public idOrcamentoFormat: string;
  public descricao: string;
  public dataOrcamento: string;
  public statusOrcamentoEnum: string;

  public latitudePes: number;
  public longitudePes: number;

  public listServicoOrcamento: ServicoOrcamentoEntity[] = [];
  
  public limitDados: number;

  constructor(){
  }
}

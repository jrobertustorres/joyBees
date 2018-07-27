export class ServicoOrcamentoEntity {

  public idServicoOrcamento: number;
  public idOrcamento: number;
  public idServico: number;
  public idServicoFornecedor: number;

  public descricao: string;
  public dataSolicitacao: Date;
  public dataSolicitacaoFormat: string;
  public quantidade: number;

  constructor(){
  }
    
}